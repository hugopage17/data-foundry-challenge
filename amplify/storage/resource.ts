import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'dataFoundryStaticFiles',
  access: (allow) => ({
    'app-icons/*': [allow.guest.to(['read']), allow.authenticated.to(['read'])]
  })
});