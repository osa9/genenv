async function getProjectId() {
    var _projectId;
    if(_projectId) return _projectId;

    const {GoogleAuth} = require('google-auth-library');

    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });
    _projectId = await auth.getProjectId();

    return _projectId;
}

async function getEnv(name) {
    const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');


    const client = new SecretManagerServiceClient();

    let secretName;
    if(name.startsWith('projects/')) {
        secretName = name;
    } else {
        const projectId = await getProjectId();
        secretName = `projects/${projectId}/secrets/${name}`;
    }

    if (!secretName.includes('/versions/')) {
        secretName += '/versions/latest';
    }

    //const projectId = await getProjectId()

    const [secret] = await client.accessSecretVersion({
        name: secretName
    })


    return secret.payload.data;
}

async function generateEnv(env, outputs) {
    lines = []

    for(let key in env) {
        const item = env[key];

        let data;
        try {
            data = await getEnv(item.id);
        } catch(err) {
            if (item.default) {
                data = item.default;
            } else {
                throw Error(`Cannot read secret: ${item.id}`)
            }
        }

        if (item.type === 'string') {
            lines.push(`${key}=${data.toString('utf8')}`)
        } else if(item.type === 'file') {
            outputs[key] = data;
        }

    }

    return lines.join('\n');
}

async function generate(envs, outputs) {
    for (let envKey in envs) {
        outputs[`${envKey}.env`] = await generateEnv(envs[envKey], outputs);
    }
}

exports.generate = generate;