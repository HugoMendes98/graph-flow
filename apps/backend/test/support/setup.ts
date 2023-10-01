import { config } from "../../src/config.e2e";
// eslint-disable-next-line import/order -- before `ormConfig`
import { _setConfiguration } from "../../src/configuration";

// Override configuration before its use
_setConfiguration(config);

// eslint-disable-next-line import/first -- After config, override orm-config
import ormConfig from "../../src/orm.config";

ormConfig.allowGlobalContext = true;
