import { Clipboard } from "@raycast/api";
import postcss from "postcss";
import tailwind from "tailwindcss";
import css from "css";

export default async function Command() {
  const content = await Clipboard.readText().then((v) => `<div class="${v}"></div>`);
  const input = `
    @tailwind utilities;
  `;

  const config = {
    content: [{ raw: content }],
    corePlugins: { preflight: false },
  };

  const res = await postcss(tailwind(config)).process(input, { from: undefined });

  const value = css
    .parse(res.css)
    .stylesheet.rules.reduce((agg, rule) => [...agg, ...(rule.declarations ?? [])], [])
    .reduce((agg, { property, value }) => agg + `${property}: ${value};\n`, "");

  Clipboard.paste(value);
}
