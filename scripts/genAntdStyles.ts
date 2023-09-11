import { extractStyle } from 'ant-design-vue/es/_util/static-style-extract'
import fs from 'node:fs/promises'
import { theme, ConfigProvider } from 'ant-design-vue'
import { h } from 'vue'

const defaultTheme = {
  ...theme.defaultConfig,
  token: {
    colorPrimary: '#8921ff'
  }
}

// const lightTheme = { ...defaultTheme, algorithm: theme.defaultAlgorithm }
// const darkTheme = { ...defaultTheme, algorithm: theme.darkAlgorithm }

export const genAntdStyle = async () => {
  const css = extractStyle(
    (node) =>
      h(
        ConfigProvider,
        {
          theme: defaultTheme
        },
        () => node
      )
    // h(
    //   ConfigProvider,
    //   {
    //     theme: darkTheme
    //   },
    //   () => node
    // )
  )
  await fs.writeFile('public/css/antd.css', css, {
    encoding: 'utf8'
  })
}

genAntdStyle()
