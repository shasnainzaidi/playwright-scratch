import { test as setup, request } from '@playwright/test';
import { loginData } from '../../test-data/loginData';

setup('@regression api authenticate', async () => {

    const apiContext = await request.newContext();

    const response = await apiContext.post(
        'https://auth.olx.com.pk/auth/realms/olx-pk/protocol/openid-connect/token',
         {
             headers: {
                             'Content-Type': 'application/x-www-form-urlencoded'
                         },
        form: {
            grant_type: 'password',
            client_id: 'frontend',
            scope: 'openid',
            type: 'phone_password',
            phone_number: loginData.validUser.phone,
            password: loginData.validUser.password
        }
    });

    if (!response.ok()) {
        throw new Error('API Login failed');
    }

    await apiContext.storageState({
        path: 'playwright/.auth/phoneAuth.json'
    });
});
