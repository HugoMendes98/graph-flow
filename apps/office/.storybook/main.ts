import { StorybookConfig } from "@storybook/angular";

const config: StorybookConfig = {
	addons: ["@storybook/addon-essentials"],
	docs: { autodocs: true },
	framework: "@storybook/angular",
	stories: ["../src/app/**/*.stories.mdx", "../src/app/**/*.stories.@(js|ts)"]
};
module.exports = config;
