require('dotenv').config();
const chalk = require('chalk');
const { series } = require('nps-utils');

module.exports = {
    scripts: {
        default: 'nps publish',
        /*
         * Run the index in development mode
         */
        publish: {
            script: publish_help(),
            silent: true,
            description: 'Show the publish help instructions',
            patch: {
                script: publish('patch'),
                silent: true,
                description: 'Manually publish the app with a patch'
            },
            minor: {
                script: publish('minor'),
                silent: true,
                description: 'Manually publish the app with a minor release'
            },
            major: {
                script: publish('major'),
                silent: true,
                description: 'Manually publish the app with a major release'
            },
        },
        vsce: {
            script: vsce('patch')
        }
    }
}

function publish_help() {
    return 'echo "' +
    chalk.bold.gray('Welcome to the publish help.\n\n') +
    chalk.bold.red('You should let the CI auto-publishes your extension to VSCode when creating a release. See GitHub Actions in this project for more information.\n\n') +
    chalk.gray('If you still want to manually publish your extension, you should specify one of "patch", "minor" or "major". ') +
    chalk.gray('The version in package.json as well as the finished packaged extension will be automatically updated by vsce.\n') +
    chalk.gray('Note that you need to have a .env file configured with your AZURE_TOKEN in it. See .env.example for info.\n\n') +
    chalk.red('Run as one of: \n\tnpm start publish.patch\n\tnpm start publish.minor\n\tnpm start publish.major\nIn order to manually publish."');
}

function publish(semver) {
    return series(
        'echo "' +
        chalk.bold.red('You should let the CI auto-publishes your extension to VSCode when creating a release. See GitHub Actions in this project for more information."'),
        'echo ""',
        'read -r -p "Are you really sure you want to manually publish? [Y/N] " -n 1',
        `if [[ $REPLY =~ ^[Yy]$ ]]; then ${vsce(semver)}; fi`
    )
}

function vsce(semver) {
    return `npx vsce publish ${semver} -p ${process.env.AZURE_TOKEN}`;
}