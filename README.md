# jest-runner
Run jest on node files in AWS lambda

# Prerequisite
Update Github Access Token

Add github access token in script of `index.html` file by following below steps.



- Step1: Generate Access Token from : https://github.com/settings/tokens
- Step2: https://github.com/NUS-ALSET/jest-runner/blob/master/index.html#L530



replace  `<github_access_token>` with you access_token here `this._accessToken = '<github_access_token>';`

#Step to deploy
- `npm i`
- `npx serverless config credentials --provider aws --key <API KEY> --secret <SECRET KEY>`
- `npm run deploy`