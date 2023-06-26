// this import must be at the top to override the app configuration
import "~/app/backend/test/support/setup";

import axios from "axios";
import { configTest } from "~/app/backend/test/support/config.test";

module.exports = function () {
	// Configure axios for tests to use.
	const { globalPrefix, name: host, port } = configTest.host;
	axios.defaults.baseURL = `http://${host}:${port}${globalPrefix}`;
};
