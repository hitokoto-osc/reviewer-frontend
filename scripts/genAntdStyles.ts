import { extractStyle } from 'ant-design-vue/es/_util/static-style-extract'
import fs from 'node:fs/promises'
export const genAntdStyle = async () => {
  const css = extractStyle()
  await fs.writeFile('public/css/antd.css', css, {
    encoding: 'utf8'
  })
}

genAntdStyle()
