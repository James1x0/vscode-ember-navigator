const path = require('path');

const NavigationStrategy = require('../abstractions/navigation-strategy');

class ComponentNavigationStrategy extends NavigationStrategy {
  execute() {
    this.destinations.push(...[
      {
        path: path.join(this.location.project, this.location.parent, 'templates', 'components', this.location.optDirectories, `${this.location.file}.hbs`),
        icon: 'javascript',
        namespace: 'templates'
      },
      {
        path: path.join(this.location.project, this.location.parent, 'components', this.location.optDirectories, `${this.location.file}.hbs`),
        icon: 'javascript',
        namespace: 'templates'
      },
      {
        path: path.join(this.location.project, 'tests', 'integration', this.location.namespace, this.location.optDirectories, `${this.location.file}-test.js`),
        icon: 'javascript-test',
        namespace: 'tests'
      }
    ]);

    return super.execute();
  }
}

module.exports = ComponentNavigationStrategy;