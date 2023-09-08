<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLogisticsDetail } from '@/services/order'
import { useRoute } from 'vue-router'
import type { ExpressResponseType, LogisticsInfo } from '@/types/order'
import startImg from '@/assets/start.png'
import endImg from '@/assets/end.png'
import carImg from '@/assets/car.png'
const route = useRoute()
const DetailList = ref<ExpressResponseType>()
// const LogisticsDetail = async () => {
//   const res = await getLogisticsDetail(route.params.id as string)
//   DetailList.value = res.data
// }
// LogisticsDetail()

import AMapLoader from '@amap/amap-jsapi-loader'
// 配置jscode
window._AMapSecurityConfig = {
  securityJsCode: '415e917da833efcf2d5b69f4d821784b'
}
onMounted(async () => {
  const res = await getLogisticsDetail(route.params.id as string)
  DetailList.value = res.data
  AMapLoader.load({
    key: '4eed3d61125c8b9c168fc22414aaef7e', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0' // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  })
    .then((AMap) => {
      // 初始化地图
      const map = new AMap.Map('map', {
        // s设置缩放比
        zoom: 12,
        // 给地图设置孩子主题
        mapStyle: 'amap://styles/whitesmoke'
      })

      AMap.plugin('AMap.Driving', function () {
        let driving = new AMap.Driving({
          map: map,
          // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
          policy: AMap.DrivingPolicy.LEAST_TIME,
          showTraffic: false,
          hideMarkers: true
        })
        if (
          DetailList.value?.logisticsInfo &&
          DetailList.value.logisticsInfo.length >= 2
        ) {
          const list = [...DetailList.value.logisticsInfo]
          // 起点
          let startLngLat = list.shift()
          // 终点
          let endLngLat = list.pop()
          const getMarker = (
            point: LogisticsInfo,
            image: string,
            width = 25,
            height = 30
          ) => {
            const icon = new AMap.Icon({
              size: new AMap.Size(width, width), // 图标尺寸
              image: image, // Icon的图像
              imageSize: new AMap.Size(width, height)
            })

            // 将 Icon 实例添加到 marker 上:
            const marker = new AMap.Marker({
              position: [point?.longitude, point?.latitude],
              icon: icon, // 添加 Icon 实例
              zoom: 13,
              angle: 217
            })

            return marker
          }
          const startMarker = getMarker(endLngLat!, startImg)
          map.add(startMarker)
          const endMarker = getMarker(startLngLat!, endImg)
          map.add(endMarker)
          driving.search(
            [startLngLat?.longitude, startLngLat?.latitude],
            [endLngLat?.longitude, endLngLat?.latitude],
            {
              waypoints: list.map((item) => [item.longitude, item.latitude])
            },
            function () {
              // 未出错时，result即是对应的路线规划方案
              // 当前车辆的位置
              const curr = DetailList.value?.currentLocationInfo

              // 添加车辆标注点
              const currMarker = getMarker(curr!, carImg, 33, 20)

              map.add(currMarker)

              setTimeout(() => {
                map.setFitView([currMarker])
                map.setZoom(10)
              }, 3000)
            }
          )
        }
      })
    })
    .catch((e) => {
      console.error(e) //加载错误提示
    })
})
</script>
<template>
  <div class="Logistics">
    <div id="map">
      <div class="navBar">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ DetailList?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="map-bom">
        <p>
          {{ DetailList?.statusValue }}——预计{{ DetailList?.estimatedTime }}
        </p>
        <p>
          {{ DetailList?.name }}
          <span style="margin-left: 10px">{{ DetailList?.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="(item, index) in DetailList?.list" :key="index">
          <p class="status">{{ item.statusValue }}</p>
          <p class="content">{{ item.content }}</p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.Logistics {
  #map {
    height: 450px;
    background: var(--cp-bg);
    position: relative;
    .navBar {
      z-index: 999;
      width: 355px;
      height: 46px;
      background: #fff;
      padding: 0 10px;
      position: absolute;
      left: 10px;
      top: 10px;
      display: flex;
      text-align: center;
      align-items: center;
      box-sizing: border-box;
      > span {
        flex: 1;
      }
      .van-icon {
        font-size: 18px;
        color: #666;
        &:last-child {
          color: var(--cp-primary);
        }
      }
    }
    .map-bom {
      height: 80px;
      border-radius: 4px;
      background-color: #fff;
      width: 355px;
      box-sizing: border-box;
      padding: 15px;
      position: absolute;
      left: 10px;
      bottom: 10px;
      box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
      z-index: 999;
      > p:first-child {
        font-size: 15px;
        line-height: 26px;
      }
      > p:last-child {
        color: var(--cp-tip);
        font-size: 13px;
        margin-top: 5px;
      }
    }
  }
  .logistics {
    padding: 0 10px 20px;
    .title {
      font-size: 16px;
      padding: 15px 5px 5px;
    }
  }
  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
