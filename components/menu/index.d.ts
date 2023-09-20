export interface Item {
  icon?: VNode | (() => VNode)
  vantIcon?: string // FIXME: Vant 目前不支持 SVG 图标，因此这里使用字符串
  text: string | Ref<string>
  onClick?: (event?: MouseEvent | PointerEvent) => void
  to?: string
  href?: string
  preventContextMenu?: boolean
}
