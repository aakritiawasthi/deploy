import { Deployment } from '@metacall/protocol/deployment';
import { API as APIInterface } from '@metacall/protocol/protocol';
import args from './cli/args';
import { error, info } from './cli/messages';
import { del } from './delete';

export const force = async (api: APIInterface): Promise<string> => {
	info('Trying to deploy forcefully!');

	const suffix = args['addrepo']
		? args['addrepo']?.split('com/')[1].split('/').join('-')
		: args['projectName'].toLowerCase();

	let res = '';

	try {
		const repoSubscriptionDetails = (
			await api.listSubscriptionsDeploys()
		).filter(dep => dep.deploy === suffix);

		const repo: Deployment[] = (await api.inspect()).filter(
			dep => dep.suffix == suffix
		);

		if (repo) {
			res = await del(
				repo[0].prefix,
				repo[0].suffix,
				repo[0].version,
				api
			);
			args['plan'] = repoSubscriptionDetails[0].plan;
		}
	} catch (e) {
		error(
			'Deployment Aborted because this directory is not being used by any applications.'
		);
	}

	return res;
};

// One improvement can be done is, if with force flag, a person tries to deploy an app, and the app is not present actually there then it should behave as normal deployment procedure
