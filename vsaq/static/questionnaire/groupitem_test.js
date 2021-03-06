/**
 * @license
 * Copyright 2016 Google Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Tests for vsaq.questionnaire.items.GroupItem.
 */

goog.provide('vsaq.questionnaire.items.GroupItemTests');
goog.setTestOnly('vsaq.questionnaire.items.GroupItemTests');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.testing.asserts');
goog.require('goog.testing.jsunit');
goog.require('vsaq.questionnaire.items.CheckItem');
goog.require('vsaq.questionnaire.items.CheckgroupItem');
goog.require('vsaq.questionnaire.items.GroupItem');
goog.require('vsaq.questionnaire.items.RadioItem');
goog.require('vsaq.questionnaire.items.RadiogroupItem');


var TEST_CHECKGROUP = {
  'type': 'checkgroup',
  'defaultChoice': true,
  'text': 'caption',
  'choices': [
    {'choice_id_1': 'Text 1'},
    {'choice_id_2': 'Text 2'}
  ],
  'choicesConds': []
};

var TEST_RADIOGROUP = {
  'type': 'radiogroup',
  'text': 'caption',
  'defaultChoice': false,
  'choices': [
    {'choice_id_1': 'Text 1'},
    {'choice_id_2': 'Text 2'}
  ],
  'choicesConds': []
};

var checkgroupItem, radiogroupItem;


/**
 * Initializes variables used by all tests.
 */
function setUp() {
  checkgroupItem = new vsaq.questionnaire.items.CheckgroupItem(
      null, null, TEST_CHECKGROUP.text, TEST_CHECKGROUP.defaultChoice,
      TEST_CHECKGROUP.choices, TEST_CHECKGROUP.choicesConds);

  radiogroupItem = new vsaq.questionnaire.items.RadiogroupItem(
      null, null, TEST_RADIOGROUP.text, TEST_RADIOGROUP.defaultChoice,
      TEST_RADIOGROUP.choices, TEST_RADIOGROUP.choicesConds);
}


/**
 * Tests whether all possible GroupItems are initialized correctly.
 */

function testGroupItem() {

  var defaultChoiceFound;

  // First verify the correctness of check groups.
  defaultChoiceFound = false;

  var expectedNumberChoices = TEST_CHECKGROUP.choices.length;

  if (TEST_CHECKGROUP['defaultChoice'])
    expectedNumberChoices++;
  assert(expectedNumberChoices == checkgroupItem.containerItems.length);

  goog.array.forEach(checkgroupItem.containerItems, function(item) {
    assert(item instanceof vsaq.questionnaire.items.CheckItem);
    // All choices are supposed to have the containerItem as a parent.
    assertNotUndefined(item.parentItem);

    if (item.text == vsaq.questionnaire.items.GroupItem.DEFAULT_CHOICE)
      defaultChoiceFound = true;
  });
  assert(defaultChoiceFound == TEST_CHECKGROUP['defaultChoice']);

  // Now verify the correctness of radio groups.
  defaultChoiceFound = false;
  expectedNumberChoices = TEST_RADIOGROUP.choices.length;
  if (TEST_RADIOGROUP['defaultChoice'])
    expectedNumberChoices++;
  assert(expectedNumberChoices == radiogroupItem.containerItems.length);

  goog.array.forEach(radiogroupItem.containerItems, function(item) {
    assert(item instanceof vsaq.questionnaire.items.RadioItem);
    // All choices are supposed to have the containerItem as a parent.
    assertNotUndefined(item.parentItem);

    if (item.text == vsaq.questionnaire.items.GroupItem.DEFAULT_CHOICE)
      defaultChoiceFound = true;
  });
  assert(defaultChoiceFound == TEST_RADIOGROUP['defaultChoice']);
}


/**
 * Tests whether all possible GroupItems are render correctly with highlight
 */
function testGroupItemRerender() {
  var el = checkgroupItem.container;
  var span = goog.dom.getFirstElementChild(goog.dom.getFirstElementChild(el));
  assertTrue(
      'Class not set', goog.dom.classlist.contains(span, 'vsaq-label-text'));

  checkgroupItem.render(true);
  el = checkgroupItem.container;
  span = goog.dom.getFirstElementChild(goog.dom.getFirstElementChild(el));
  assertTrue(
      'Class not set', goog.dom.classlist.contains(span, 'vsaq-label-text'));
}


/**
 * Tests parsing of all possible GroupItems.
 */
function testGroupItemParse() {

  var testStack = [TEST_CHECKGROUP];
  checkgroupItem = vsaq.questionnaire.items.CheckgroupItem.parse(testStack);
  assert(checkgroupItem instanceof vsaq.questionnaire.items.CheckgroupItem);
  for (var i = 0; i < checkgroupItem.containerItems.length; ++i)
    assertFalse('readonly' == checkgroupItem.containerItems[i].auth);

  testStack = [TEST_RADIOGROUP];
  radiogroupItem = vsaq.questionnaire.items.RadiogroupItem.parse(testStack);
  assertFalse(radiogroupItem.required);
  assert(radiogroupItem instanceof vsaq.questionnaire.items.RadiogroupItem);
  for (var i = 0; i < radiogroupItem.containerItems.length; ++i)
    assertFalse('readonly' == radiogroupItem.containerItems[i].auth);

  // Verify all items once again
  testGroupItem();

  // testing readonly functionality
  var TEST_CHECKGROUP2 = {
    'type': 'checkgroup',
    'defaultChoice': true,
    'text': 'caption',
    'choices': [{'choice_id_1': 'Text 1'}, {'choice_id_2': 'Text 2'}],
    'choicesConds': [],
    'required': true,
    'auth': 'readonly'
  };

  var TEST_RADIOGROUP2 = {
    'type': 'radiogroup',
    'text': 'caption',
    'defaultChoice': false,
    'choices': [{'choice_id_1': 'Text 1'}, {'choice_id_2': 'Text 2'}],
    'choicesConds': [],
    'required': true,
    'auth': 'readonly'
  };
  testStack = [TEST_CHECKGROUP2];
  checkgroupItem = vsaq.questionnaire.items.CheckgroupItem.parse(testStack);
  assertTrue(checkgroupItem.required);
  assert(checkgroupItem instanceof vsaq.questionnaire.items.CheckgroupItem);
  for (var i = 0; i < checkgroupItem.containerItems.length; ++i)
    assertEquals('readonly', checkgroupItem.containerItems[i].auth);

  testStack = [TEST_RADIOGROUP2];
  radiogroupItem = vsaq.questionnaire.items.RadiogroupItem.parse(testStack);
  assertTrue(radiogroupItem.required);
  assert(radiogroupItem instanceof vsaq.questionnaire.items.RadiogroupItem);
  for (var i = 0; i < radiogroupItem.containerItems.length; ++i)
    assertEquals('readonly', radiogroupItem.containerItems[i].auth);

  // Verify all items once again
  testGroupItem();
}
