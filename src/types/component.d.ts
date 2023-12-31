import cpNavBar from '@/components/cp-nav-bar.vue'
import cpIcon from '@/components/cp-icon.vue'
import cpRadioBtn from '@/components/cp-radio-btn.vue'
import cpPaySheet from '@/components/cp-pay-sheet.vue'
declare module 'vue' {
  interface GlobalComponents {
    cpNavBar: typeof cpNavBar
    cpIcon: typeof cpIcon
    cpRadioBtn: typeof cpRadioBtn
    cpPaySheet: typeof cpPaySheet
  }
}
