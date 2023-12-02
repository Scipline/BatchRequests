import asyncio
import logging

from aiohttp import ClientSession
import json
import sys

LOGGER = logging.getLogger(__name__)


async def send_code(session):
    try:
        url = "https://faucet.openkey.cloud/api/send_verification_code"

        payload = json.dumps({
            "email": email
        })
        result = ''
        async with session.post(url, data=payload, ssl=False) as response:
            response.raise_for_status()
            result = await response.json()
            res = result.get('message')
            if "已发送" in res:
                pass
            elif "耐心等待" in res:
                raise Exception("距离上次获取不足24小时")
            else:
                raise Exception("发送验证码失败")
    except Exception as e:
        LOGGER.error(f"发送验证码失败,错误:{e}")
        LOGGER.log(logging.INFO, msg=result)
        sys.exit(1)


async def get_key(session, verify_code):
    try:
        url = "https://faucet.openkey.cloud/api/verify_code"
        payload = json.dumps({
            "email": email,
            "code": verify_code
        })
        result = ''
        async with session.post(url, data=payload, ssl=False) as response:
            response.raise_for_status()
            result = await response.json()
            # res = json.dumps(result, indent=4, ensure_ascii=False)
            # print(res)
            if token := result.get('token'):
                print(token)
            else:
                raise Exception("获取key失败")
    except Exception as e:
        LOGGER.error(f"获取key失败,错误:{e}")
        LOGGER.log(logging.INFO, msg=result)
        sys.exit(1)


async def main():
    headers = {
        'authority': 'faucet.openkey.cloud',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.7',
        'cache-control': 'no-cache',
        'dnt': '1',
        'origin': 'https://faucet.openkey.cloud',
        'pragma': 'no-cache',
        'referer': 'https://faucet.openkey.cloud/',
        'sec-ch-ua': '"Brave";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        'content-type': 'application/json'
    }
    async with ClientSession(headers=headers) as session:
        await send_code(session)
        verify_code = int(input("请输入验证码:").strip())
        await get_key(session, verify_code)


if __name__ == '__main__':
    email = input("请输入邮箱:").strip()
    asyncio.run(main())
