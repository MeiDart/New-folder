const usersContainer = document.getElementById('user-list')
const userForm = document.getElementById('user-form')
const usersElement = document.getElementById('users-wrapper')
const nameUserInput = document.getElementById('input-name') 
const emailUserInput = document.getElementById('input-email') 
const notify = document.getElementById('notify')
const notifyText = document.getElementById('notify-text')
const icUserFormBtn = document.getElementById('ic-left')
const popup = document.getElementById('popup')
const popupInnerUser = document.getElementById('popup-inner-user')
let loadingElement = undefined

/* ----- buttons ----- */
const reloadUsersBtn = document.getElementById('reload-user-btn')
const addUserBtn = document.getElementById('add-user-btn')
const updateUserBtn = document.getElementById('update-user-btn')
const deleteUserBtn = document.getElementById('delete-user-btn')
const clearBtn = document.getElementById('clear-inputs')
const userFormBtn = document.getElementById('btn-user-form')
const loadMoreBtn = document.getElementById('btn-load-more')
const notifiBtnOk = document.getElementById('notifi-btn-ok')
const notifiBtnCancel = document.getElementById('notifi-btn-cancel')
/* ------------------- */

let users = []
let lastUsersResponse = []
let page_load = 1
let selectedUser = null
let firstOpen = true
let opened = false

const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const getUsers = (page) => { 
  fetch(`https://reqres.in/api/users?page=${page}`)
    .then(response => response.json())
    .then(result => {
      const prev_length = users.length
      lastUsersResponse = result.data
      users = [
        ...users,
        ...lastUsersResponse
      ]
      if (page > 1) {
        renderUsers(users, prev_length)
        console.log('fetch more')
      }
      else renderUsers(users)
    })
    .catch(err => console.error(err))
}

getUsers(page_load)

const renderUsers = (users, prevLength) => {
  loadMoreBtn.style.display = 'none'
  let loading = document.createElement('span')
  loading.setAttribute('style', `font-family: 'Poppins', san-serif; opacity: 0.5;`)
  loading.innerHTML = 'Loading...'
  if(!prevLength) usersElement.innerHTML = ''
  usersElement.appendChild(loading)
  setTimeout(() => {
    usersElement.removeChild(loading)
    for(let i = prevLength ? prevLength : 0; i < users.length; i++) {
      let itemElement = document.createElement('div')
      itemElement.setAttribute('class', 'user')
      itemElement.innerHTML = 
      `
        <img src="${users[i].avatar}" alt="avatar"/>
        <div class="infos-wrapper">
          <div class="infos">
            <h3 class="user-name">${users[i].first_name + ' ' + users[i].last_name}</h3>
            <p class="user-email">${users[i].email}</p>
          </div>
        </div>
      ` 
      itemElement.onclick = () => {
        setSelectedUser(users[i])
        openUserForm()
      }
      usersElement.appendChild(itemElement) 
    }
    loadMoreBtn.style.display = lastUsersResponse.length === 0 ? 'none' : 'flex'
  }, 1200)
}

const resetSelectedUser = () => {
  selectedUser = null
  updateUserBtn.style.display = 'none'
  deleteUserBtn.style.display = 'none'
  nameUserInput.value = ''
  emailUserInput.value = ''
  addUserBtn.style.display = 'inline-block'
  reloadUsersBtn.style.display = 'inline-block'
  clearBtn.style.display = 'none'
}

const setSelectedUser = user => {
  selectedUser = user
  addUserBtn.style.display = 'none'
  reloadUsersBtn.style.display = 'none'
  clearBtn.style.display = 'inline-block'
  updateUserBtn.style.display = 'inline-block'
  deleteUserBtn.style.display = 'inline-block'
  nameUserInput.value = selectedUser.first_name + ' ' + selectedUser.last_name
  emailUserInput.value = selectedUser.email
}

const openUserForm = () => {
  opened = true
  if(firstOpen) {
    resetSelectedUser()
    firstOpen = false
  }
  icUserFormBtn.style.transform = 'rotate(180deg)'
  setTimeout(() => {
    usersContainer.style.width = window.innerWidth <= 912 ? '100%' : '50%'
    userForm.style.opacity = '1'
  }, 200)
  userForm.style.display = 'flex'
  userForm.style.width = window.innerWidth <= 912 ? '100%' : '50%'
}

const closeUserForm = () => {
  opened = false
  icUserFormBtn.style.transform = 'rotate(0deg)'
  usersContainer.style.width = '100%'
  userForm.style.opacity = '0'
  userForm.style.width = '0px'
  setTimeout(() => userForm.style.display = 'none', 720)
}

const displayNofify = text => {
  notify.style.width = '400px'
  notify.style.height = '60px'
  setTimeout(() => {
    notifyText.style.opacity = '1'
  }, 300)
  notifyText.innerHTML = text
  setTimeout(() => {
    notifyText.style.opacity = '0'
  }, 4600)
  setTimeout(() => {
    notify.style.width = '0px'
    notify.style.height = '0px'
  }, 4800)
}

reloadUsersBtn.onclick = () => renderUsers(users)

addUserBtn.onclick = () => {
  users = [
    ...users, 
    {
      id: getRandomInteger(1, 1000),
      first_name: nameUserInput.value, 
      last_name: '',
      email: emailUserInput.value,
      avatar: 'https://tinyurl.com/3447zdrm'
    }
  ]
  renderUsers(users)
  displayNofify('Thêm user thành công')
}

updateUserBtn.onclick = () => {
  const userUpdate = users.find(user => user.id === selectedUser.id)
  userUpdate.first_name = nameUserInput.value
  userUpdate.last_name = ''
  userUpdate.email = emailUserInput.value
  renderUsers(users)
  displayNofify(`Cập nhật user #${selectedUser.id} thành công`)
  resetSelectedUser()
}

deleteUserBtn.onclick = () => {
  popup.style.display = 'block'
  popupInnerUser.innerHTML = 
  `
    <img src="${selectedUser.avatar}" alt="avatar"/>
    <div class="infos-wrapper">
      <div class="infos">
        <h3 class="user-name">${selectedUser.first_name + ' ' + selectedUser.last_name}</h3>
        <p class="user-email">${selectedUser.email}</p>
      </div>
    </div>
  `
}

clearBtn.onclick = () => resetSelectedUser()

popup.onclick = () => popup.style.display = 'none'
notifiBtnCancel.onclick = () => popup.style.display = 'none'

notifiBtnOk.onclick = () => {
  const removeIndex = users.findIndex(user => user.id === selectedUser.id)
  users.splice(removeIndex, 1)
  renderUsers(users)
  popup.style.display = 'none'
  displayNofify(`Xóa user #${selectedUser.id} thành công`)
  resetSelectedUser()
  maxUsersAmount -= 1
}

userFormBtn.onclick = () => {
  if(!opened) openUserForm()
  else closeUserForm()
}

loadMoreBtn.onclick = () => {
  loadMoreBtn.style.display = 'none'
  page_load += 1
  getUsers(page_load)
}