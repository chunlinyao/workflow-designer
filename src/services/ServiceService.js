import SecureEndpoint from '@/services/SecureEndpoint'

export default {
  services (payload) {
    return SecureEndpoint().get('/moqui-workflow/basic/service', {
      params: payload
    })
  }
}
