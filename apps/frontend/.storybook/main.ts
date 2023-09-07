import { StorybookConfig } from "@storybook/angular";

const config: StorybookConfig = {
	addons: [
		"@storybook/addon-interactions",
		"@storybook/addon-essentials",
		{ name: "@storybook/addon-storysource", options: {} }
	],
	docs: { autodocs: true },
	framework: { name: "@storybook/angular", options: {} },
	stories: ["../src/app/**/*.stories.@(js|jsx|ts|tsx|mdx)"]
};
export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
