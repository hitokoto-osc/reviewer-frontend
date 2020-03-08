<template>
  <a-row
    type="flex"
    justify="start"
    class="mt-5"
  >
    <a-col
      :md="{ span: 8, offset: 8 }"
      :sm="{ span: 20, offset: 2 }"
      :xs="{ span: 22, offset: 1 }"
    >
      <a-card :bordered="false">
        <template v-slot:title>
          <div class="auth-title">
            须要验证您的身份
          </div>
        </template>
        <p>
          请输入您在 <a
            href="https://hitokoto.cn/dashboard/#/user/settings"
            target="_blank"
          >hitokoto.cn</a> 获得的令牌（<code>token</code>）以验证身份。
        </p>
        <a-form
          :form="form"
          @submit="handleSubmit"
        >
          <a-form-item
            :validate-status="validator || (tokenError() ? 'error' : '')"
            :help="validatorText || tokenError() || ''"
            :has-feedback="!!validator"
          >
            <a-input
              v-decorator="[
                'token',
                { rules: [
                  { required: true, message: '请填写令牌' },
                  { len: 40, message: '令牌长度不符' }
                ] },
              ]"
              placeholder="请输入您的令牌……"
            />
          </a-form-item>
          <a-button
            :disabled="hasErrors(form.getFieldsError())"
            :loading="isRequest"
            type="primary"
            html-type="submit"
          >
            身份认证
          </a-button>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

export default {
  auth: false,
  data () {
    return {
      hasErrors,
      form: this.$form.createForm(this, { name: 'authorization' }),
      isRequest: false,
      validatorText: undefined,
      validator: undefined
    }
  },
  computed: {
    getToken () {
      return this.$store.state.token.token || this.$cookies.get('token')
    }

  },
  mounted () {
    this.$nextTick(() => {
      this.form.validateFields()
    })
    this.$notification.config({
      placement: 'bottomRight'
    })
    if (this.getToken && this.getToken.length === 40) {
      this.$notification.info({
        message: '检索到本地存储存在令牌',
        description: '请稍等片刻，我们将尝试使用此凭据进行身份验证。'
      })
      const _this = this
      this.$axios.get(`https://poll.hitokoto.cn/v1/user/${this.getToken}`)
        .then((response) => {
          if (response.data.Code && response.data.Code === 200) {
            this.$store.commit('token/set', this.getToken)
            this.$cookies.set('token', this.getToken, {
              maxAge: 60 * 60 * 24 * 30
            })
            _this.$notification.success({
              message: '身份验证成功',
              description: '现在，我们将转跳至控制台。'
            })
            _this.$router.push('/dashboard')
          } else {
            _this.$notification.warning({
              message: '令牌已失效',
              description: '无法验证您的身份，您需要更新您的令牌。'
            })
          }
        })
    }
  },
  methods: {
    tokenError () {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('token') && getFieldError('token')
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.isRequest = true
          this.validator = 'validating'
          const { token } = values
          const { data } = await this.$axios.get('https://poll.hitokoto.cn/v1/user/' + token)
          const { Code } = data
          if (Code !== 200) { // 验证失败
            if (Code === 403) {
              this.validator = 'error'
              this.validatorText = '令牌无效，请检查后再次尝试。'
            } else if (Code === 500) {
              this.validator = 'error'
              this.validatorText = '服务器错误，请稍后再试。'
            } else {
              window.console.error(data)
              this.validator = 'error'
              this.validatorText = '未知错误，建议联系管理员。'
            }
            this.isRequest = false
            return
          }
          this.validator = 'success'
          this.validatorText = ''

          // 保存登录信息
          this.$store.commit('token/set', token)
          this.$cookies.set('token', token, {
            maxAge: 60 * 60 * 24 * 30
          })

          this.$notification.success({
            message: '已成功验明身份',
            description:
              '您的身份已经确认，下次您将自动认证。我们将为您跳转到控制面板。'
          })
          // window.console.log(Data)
          this.isRequest = false
          this.$router.push('dashboard')
        }
      })
    }
  },
  head () {
    return {
      title: '身份认证 | 一言审核员中心'
    }
  }
}
</script>
<style>
.mt-5 {
  margin-top: 4em;
}

.auth-title {
  font-weight: 600;
}
</style>
