// this import must be at the top to override the app configuration
import "~/app/backend/test/support/setup";

import axios from "axios";
import { config } from "~/app/backend/app/config.e2e";

module.exports = function () {
	// Configure axios for tests to use.
	const { globalPrefix, name: host, port } = config.host;
	axios.defaults.baseURL = `http://${host}:${port}${globalPrefix}`;
};
