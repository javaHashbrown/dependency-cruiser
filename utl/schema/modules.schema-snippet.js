const dependencies = require("./dependencies.schema-snippet");
const sharedTypes = require("./shared-types.schema-snippet");
const ruleSummary = require("./rule-summary.schema-snippet");

module.exports = {
  definitions: {
    ...dependencies.definitions,
    ...ruleSummary.definitions,
    ...sharedTypes,
    ModulesType: {
      type: "array",
      description:
        "A list of modules, with for each module the modules it depends upon",
      items: {
        type: "object",
        required: ["source", "dependencies", "valid"],
        additionalProperties: false,
        properties: {
          source: {
            type: "string",
            description:
              "The (resolved) file name of the module, e.g. 'src/main/index.js'"
          },
          followable: {
            type: "boolean",
            description:
              "Whether or not this is a dependency that can be followed any further. This will be 'false' for for core modules, json, modules that could not be resolved to a file and modules that weren't followed because it matches the doNotFollow expression."
          },
          matchesDoNotFollow: {
            type: "boolean",
            description:
              "'true' if the file name of this module matches the doNotFollow regular expression"
          },
          coreModule: {
            type: "boolean",
            description: "Whether or not this is a node.js core module"
          },
          couldNotResolve: {
            type: "boolean",
            description:
              "'true' if dependency-cruiser could not resolve the module name in the source code to a file name or core module. 'false' in all other cases."
          },
          dependencyTypes: {
            type: "array",
            items: { $ref: "#/definitions/DependencyType" },
            description:
              "the type of inclusion - local, core, unknown (= we honestly don't know), undetermined (= we didn't bother determining it) or one of the npm dependencies defined in a package.jsom ('npm' for 'depenencies', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-no-pkg' for development, optional, peer dependencies and dependencies in node_modules but not in package.json respectively)"
          },
          license: {
            type: "string",
            description:
              "the license, if known (usually known for modules pulled from npm, not for local ones)"
          },
          orphan: {
            type: "boolean",
            description:
              "'true' if this module does not have dependencies, and no module has it as a dependency"
          },
          reachable: {
            type: "array",
            items: { $ref: "#/definitions/ReachableType" },
            description:
              "An array of objects that tell whether this module is 'reachable', and according to rule in which this reachability was defined"
          },
          valid: {
            type: "boolean",
            description:
              "'true' if this module violated a rule; 'false' in all other cases. The violated rule will be in the 'rule' object at the same level."
          },
          rules: {
            type: "array",
            items: { $ref: "#/definitions/RuleSummaryType" },
            description:
              "an array of rules violated by this module - left out if the module is valid"
          },
          dependencies: { $ref: "#/definitions/DependenciesType" }
        }
      }
    },
    ReachableType: {
      type: "object",
      required: ["value", "asDefinedInRule"],
      additionalProperties: false,
      properties: {
        value: {
          type: "boolean",
          description:
            "'true' if this module is reachable from any of the modules matched by the from part of a reachability-rule in 'asDefinedInRule', 'false' if not."
        },
        asDefinedInRule: {
          type: "string",
          description: "The name of the rule where the reachability was defined"
        }
      }
    }
  }
};
