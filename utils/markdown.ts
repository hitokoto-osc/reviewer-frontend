// Markdown
import MD from 'markdown-it'
import MDEmoji from 'markdown-it-emoji'
import type Token from 'markdown-it/lib/token'
export const renderMarkdown = (markdown: string) => {
  const md = new MD({
    html: true,
    linkify: true,
    typographer: true
  })
  md.linkify.set({ fuzzyEmail: false })
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx] as Token
    if (token.attrs === null) {
      token.attrs = []
    }
    token.attrs[token.attrIndex('alt')][1] = self.renderInlineAsText(
      token.children || [],
      options,
      env
    )
    token.attrSet('data-fancybox', '')
    return self.renderToken(tokens, idx, options)
  }
  md.use(MDEmoji)
  return md.render(markdown)
}
