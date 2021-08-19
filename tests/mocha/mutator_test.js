
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

suite('Mutator', function() {
  setup(function() {
    sharedTestSetup.call(this);
  });

  suite('Firing change event', function() {
    setup(function() {
      this.workspace = Blockly.inject('blocklyDiv', {});
      defineMutatorBlocks();
    });

    teardown(function() {
      Blockly.Extensions.unregister('xml_mutator');
      Blockly.Extensions.unregister('jso_mutator');
      sharedTestTeardown.call(this);
    });

    test('No change', function() {
      var block = createRenderedBlock(this.workspace, 'xml_block');
      block.mutator.setVisible(true);
      var mutatorWorkspace = block.mutator.getWorkspace();
      // Trigger mutator change listener.
      createRenderedBlock(mutatorWorkspace, 'checkbox_block');
      chai.assert.isTrue(
          this.eventsFireStub.getCalls().every(
              ({args}) =>
                args[0].type !== Blockly.Events.BLOCK_CHANGE ||
                args[0].element !== 'mutation'));
    });

    test('XML', function() {
      var block = createRenderedBlock(this.workspace, 'xml_block');
      block.mutator.setVisible(true);
      var mutatorWorkspace = block.mutator.getWorkspace();
      mutatorWorkspace.getBlockById('check_block')
          .setFieldValue('TRUE', 'CHECK');
      chai.assert.isTrue(
          this.eventsFireStub.getCalls().some(
              ({args}) =>
                args[0].type === Blockly.Events.BLOCK_CHANGE &&
                args[0].element === 'mutation' &&
                /<mutation.*><\/mutation>/.test(args[0].newValue)));
    });

    test('JSO', function() {
      var block = createRenderedBlock(this.workspace, 'jso_block');
      block.mutator.setVisible(true);
      var mutatorWorkspace = block.mutator.getWorkspace();
      mutatorWorkspace.getBlockById('check_block')
          .setFieldValue('TRUE', 'CHECK');
      chai.assert.isTrue(
          this.eventsFireStub.getCalls().some(
              ({args}) =>
                args[0].type === Blockly.Events.BLOCK_CHANGE &&
                args[0].element === 'mutation' &&
                args[0].newValue === '{"hasInput":true}'));
    });
  });
});
