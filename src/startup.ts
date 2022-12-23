/*

* About File:
	
	It loads the config and assigns the jwt to the config Object
	JWT = "", empty string if the dev mode is on

*/

import { auth } from './auth';
import args from './cli/args';
import { Config, defaultPath, load } from './config';

export const startup = async (confDir: string | undefined): Promise<Config> => {
	const config = await load(confDir || defaultPath);
	const token = args['dev'] ? '' : await auth(config);

	return Object.assign(config, { token });
};
