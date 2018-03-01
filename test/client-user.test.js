/**
 * Copyright 2018 The Nakama Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require("fs");
const TIMEOUT = 5000;

// util to generate a random id.
const generateid = () => {
  return [...Array(30)].map(() => Math.random().toString(36)[3]).join('');
};

describe('User Tests', () => {
  let page;

  beforeAll(async () => {
    page = await global.__BROWSER__.newPage();

    page.on("console", msg => console.log("PAGE LOG:", msg.text()));
    page.on("error", err => console.log("PAGE LOG ERROR:", err));
    page.on("pageerror", err => console.log("PAGE LOG ERROR:", err));

    const nakamaJsLib = fs.readFileSync(__dirname + "/../dist/nakama-js.umd.js", "utf8");
    await page.evaluateOnNewDocument(nakamaJsLib);
    await page.goto("about:blank");
  }, TIMEOUT);

  it('should return current user account', async () => {
    const customid = generateid();

    const account = await page.evaluate((customid) => {
      const client = new nakamajs.Client();
      return client.authenticateCustom({ id: customid })
        .then(session => {
          return client.getAccount(session);
        });
    }, customid);

    expect(account).not.toBeNull();
    expect(account.custom_id).not.toBeNull();
    expect(account.wallet).not.toBeNull();
    expect(account.wallet).toBe("{}");
    expect(account.user).not.toBeNull();
    expect(account.user.id).not.toBeNull();
    expect(account.user.username).not.toBeNull();
    expect(account.user.lang_tag).not.toBeNull();
    expect(account.user.lang_tag).toBe("en");
    expect(account.user.metadata).not.toBeNull();
    expect(account.user.metadata).toBe("{}");
  });
}, TIMEOUT);
