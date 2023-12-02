// 获取元素
const emailInput = document.getElementById('email-input')
const getCodesBtn = document.getElementById('get-codes-btn')
const codeTableBody = document.getElementById('code-table-body')
const submitBtn = document.getElementById('submit-btn')
const resultTextarea = document.getElementById('result-textarea')

// 获取验证码按钮点击事件
getCodesBtn.addEventListener('click', async () => {
  // 获取邮件地址列表
  const emails = emailInput.value.trim().split('\n')
  // 清空验证码表格
  codeTableBody.innerHTML = ''

  // 并行协程地请求验证码，并过滤掉空的邮件地址
  await Promise.all(
    emails
      .filter((email) => email.trim() !== '')
      .map(async (email) => {
        const row = createCodeTableRow(email.trim(), '')
        row.setAttribute('data-email', email.trim()) // 添加 data-email 属性
        codeTableBody.appendChild(row)
        await getCode(email.trim(), row)
      })
  )
})

// 提交按钮点击事件
submitBtn.addEventListener('click', async () => {
  // 获取验证码表格中的数据
  const rows = codeTableBody.querySelectorAll('tr')
  const data = Array.from(rows).map((row) => ({
    email: row.getAttribute('data-email'),
    code: row.querySelector('.code-input').value.trim(),
  }))

  // 发送验证请求，并过滤掉空的验证码
  const results = await Promise.all(
    data
      .filter(({ email, code }) => code !== '')
      .map(async ({ email, code }) => {
        const result = await sendRequest(email, code)
        return { email, result }
      })
  )

  // 显示结果，并用Set去重
  const tokens = [
    ...new Set(results.filter((r) => r.result && r.result.status === 1).map((r) => r.result.token)),
  ]
  const resultText = tokens.join('\n')
  resultTextarea.value = resultText
})

// 获取验证码
async function getCode(email, row) {
  // const url = 'https://faucet.openkey.cloud/api/send_verification_code'
  const url = 'http://127.0.0.1:3300/api/send_verification_code'

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    if (data.status === 1) {
      // 发送成功，更改样式
      row.classList.add('success')
    } else {
      // 发送失败，更改样式
      row.classList.add('error')
    }
  } catch (error) {
    console.error(error)
  }
}

// 创建验证码表格行
function createCodeTableRow(email, code) {
  const row = document.createElement('tr')
  const emailCell = document.createElement('td')
  const codeCell = document.createElement('td')
  const codeInput = document.createElement('input')

  emailCell.textContent = email
  codeInput.classList.add('code-input')
  codeCell.appendChild(codeInput)
  row.appendChild(emailCell)
  row.appendChild(codeCell)

  return row
}

// 发送请求
let lock = Promise.resolve()

async function sendRequest(email, code) {
  const url = 'http://127.0.0.1:3300/api/verify_code'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
    redirect: 'follow',
  }

  lock = lock
    .then(() => fetch(url, options))
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.error(error)
      return null
    })

  return lock
}
