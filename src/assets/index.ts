window.onload = function () {
  function f1(s: number, y: number) {
    return s + y
  }
  f1(6, 7)
  function f2(s: number, y: string): string {
    return s + y
  }
  f2(6, '7')
  function f3(s: number, y: number): any {
    return s + y
  }
  f3(6, 7)
  interface Person {
    s: number
    d: string
    [propName: string]: any
  }
  const o2: Person = {
    s: 4,
    d: '3',
    max: 3,
    maxs: function () {}
  }
  function f4(s: number, y: number): any {
    return s + y
  }
  f4(6, 7)
  interface InspectFn {
    <T>(x: T, y: T): boolean
  }
  const fns: InspectFn = function (x, y) {
    return x == y
  }
  fns<string>('3', '4')
}
