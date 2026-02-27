"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const loginData_1 = require("../../test-data/loginData");
(0, test_1.test)('@regression api authenticate', async () => {
    const apiContext = await test_1.request.newContext();
    const response = await apiContext.post('https://auth.olx.com.pk/auth/realms/olx-pk/protocol/openid-connect/token', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            grant_type: 'password',
            client_id: 'frontend',
            scope: 'openid',
            type: 'phone_password',
            phone_number: loginData_1.loginData.validUser.phone,
            password: loginData_1.loginData.validUser.password
        }
    });
    if (!response.ok()) {
        throw new Error('API Login failed');
    }
    await apiContext.storageState({
        path: 'playwright/.auth/phoneAuth.json'
    });
});
//# sourceMappingURL=apiAuth.setup.js.map