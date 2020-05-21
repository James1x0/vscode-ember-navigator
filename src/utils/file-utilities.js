const vscode = require('vscode');
const fs = require('fs');

const ComponentNavigationStrategy = require('../strategies/implementations/component-strategy');
const ControllerNavigationStrategy = require('../strategies/implementations/controller-strategy');
const IntegrationTestNavigationStrategy = require('../strategies/implementations/integration-test-strategy');
const RouteNavigationStrategy = require('../strategies/implementations/route-strategy');
const TemplateNavigationStrategy = require('../strategies/implementations/template-strategy')
const UnitTestNavigationStrategy = require('../strategies/implementations/unit-test-strategy');
const UnitTestedNavigationStrategy = require('../strategies/implementations/unit-tested-strategy');

function openFile(destination = '') {
  if (fs.existsSync(destination)) {
    const file = vscode.Uri.file(destination);
    vscode.commands.executeCommand('vscode.open', file);
  }
}

exports.openFile = openFile;

function breakdown(path = '') {
  let pattern = /^(.*)[\\\/](app|addon|tests)[\\\/]([a-z0-9-]+)[\\\/].*?(components)?(.*?)([a-z0-9-]*)[.]([a-z]*)$/;
  let matches = pattern.exec(path);

  return matches ?
    {
      project: matches[1], // Ember Project Root
      parent: matches[2], // Location (app, addon or tests)
      namespace: matches[3], // Namespace
      optNamespace: matches[4], // Optional Namespace
      optDirectories: matches[5], // Optional Extra Folders
      file: matches[6], // File Name
      extension: matches[7] // Extension
    } : { };
}

exports.breakdown = breakdown;

function getPossibleDestinations(fileName) {
  let strategies = [];

  const location = breakdown(fileName);

  if (location.namespace === 'controllers') {
    strategies.push(new ControllerNavigationStrategy(location));
  }

  if (location.namespace === 'routes') {
    strategies.push(new RouteNavigationStrategy(location));
  }

  if (location.namespace === 'components' && location.extension === 'js') {
    strategies.push(new ComponentNavigationStrategy(location));
  }

  if (location.namespace === 'unit') {
    strategies.push(new UnitTestNavigationStrategy(location));
  }

  if (location.namespace === 'integration') {
    strategies.push(new IntegrationTestNavigationStrategy(location));
  }

  if (location.parent === 'app' || location.parent === 'addon') {
    strategies.push(new UnitTestedNavigationStrategy(location));
  }

  if (location.namespace === 'templates' || location.extension === 'hbs' && location.namespace === 'components') {
    strategies.push(new TemplateNavigationStrategy(location));
  }

  return [].concat.apply([], strategies.map(strategy => strategy.execute()));
}

exports.getPossibleDestinations = getPossibleDestinations;