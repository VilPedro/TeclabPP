const primaryNav = document.querySelector('.primary-navigation')
const navToggle = document.querySelector('.mobile-nav-toggle')
function showLoader () {
  const contenedor = document.getElementById('loading')
  contenedor.style.visibility = 'visible'
  contenedor.style.opacity = '3'
}

window.onload = function () {
  const contenedor = document.getElementById('loading')
  contenedor.style.visibility = 'hidden'
  contenedor.style.opacity = '0'
}
document.getElementById('filterForm').addEventListener('submit', function (event) {
  showLoader()
})
navToggle.addEventListener('click', () => {
  const visibility = primaryNav.getAttribute('data-visible')

  if (visibility === 'false') {
    primaryNav.setAttribute('data-visible', true)
    navToggle.setAttribute('aria-expanded', true)
  } else if (visibility === 'true') {
    primaryNav.setAttribute('data-visible', false)
    navToggle.setAttribute('aria-expanded', false)
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('filterForm')
  const loader = document.getElementById('loading')

  form.addEventListener('submit', function (event) {
    event.preventDefault()

    loader.style.visibility = 'visible'
    loader.style.opacity = '1'

    setTimeout(function () {
      form.submit()
    }, 4000)
  })
})
