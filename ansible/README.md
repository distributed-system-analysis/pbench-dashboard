## Ansible playbooks for installing and deploying the pbench dashboard
This will ease installation, and deployment of the pbench dashboard.

## Required
- Ansible needs to be installed on the host where you want to run this playbook
- An inventory file containing the server values defined

## Endpoint Configuration
API endpoints are defined in `public/endpoints.js` as runtime configuration variables for reference in the dashboard binary. Before deployment of the binary to a remote host, consider the configuration at `public/endpoints.js` as the file is copied to the target server during deployment. Please reference the following example for required configuration fields:

```JavaScript
window.endpoints = {
  elasticsearch: 'http://test_domain.com',
  results: 'http://test_domain.com',
  graphql: 'http://test_domain.com',
  prefix: 'test_prefix.',
  result_index: 'test_index.',
  run_index: 'test_index.'
};
```

## Run
Running the below commands from this checked-out directory to install the
pbench dashboard components locally, and then deploy hosts mentioned under
the "`[servers]`" section of the given `inventory` file.

See the `inventory` file in this directory for an example.
```
$ # First bundle the dashboard for production
$ yarn build
$
$ # First add a link to the "dist" folder where the dashboard will be built.
$ ln -sf ../dist dist
$ ansible-playbook -i inventory dashboard-install.yml
$ ansible-playbook -i inventory dashboard-deploy.yml
```
