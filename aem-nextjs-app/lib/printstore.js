/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 */

import AEMHeadless from '@adobe/aem-headless-client-js';

export class PrintStoreClient {
  static fromEnv(env = process.env) {
    if (!this.__envClient) {
      const { NEXT_PUBLIC_AEM_HOST, NEXT_GRAPHQL_ENDPOINT } = env;
      this.__envClient = new PrintStoreClient({
        serviceURL: NEXT_PUBLIC_AEM_HOST,
        endpoint: NEXT_GRAPHQL_ENDPOINT,
      });
    }
    return this.__envClient;
  }
  constructor({ serviceURL, endpoint }) {
    this.aemHeadlessClient = new AEMHeadless({
      serviceURL,
      endpoint,
      auth: ['admin', 'admin'], // TODO: dynamically set auth based on AEM instance
      fetch
    });
  }

  async getAllprintstore() {
    const queryprintstorAll = 'global-print-store/printstore-all';
    const res = await this.aemHeadlessClient.runPersistedQuery(queryprintstorAll);
    return res;
  }

  async getAdventurePaths() {
    const res = await this.getAllprintstore();
    const adventures = res?.data?.printstoreList?.items || [];
    const paths = adventures.map((item) => ({
      params: {
        path: [item.slug],
      }
    }));
    return paths;
  }

  async getAdventuresBySlug(slug) {
    const queryVariables = { 'slug': slug };
    const queryAdventuresBySlug = 'global-print-store/adventure-by-slug';
    const res = await this.aemHeadlessClient.runPersistedQuery(queryAdventuresBySlug, queryVariables);
    return res;
  }

  async getProductsResponse() {
    const getProductsQuery = 'global-print-store/get-products';
    return await this.aemHeadlessClient.runPersistedQuery(getProductsQuery);
  }

  async getProductsData() {
    const response = await this.getProductsResponse();
    return response?.data?.printstoreList?.items ?? []
  }
}
