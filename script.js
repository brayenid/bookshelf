const identitasBuku = []
const RENDER_ARRAY = 'render-array'
document.addEventListener('DOMContentLoaded', function () {
  const formSubmit = document.getElementById('kotakSubmit')
  formSubmit.addEventListener('submit', function (e) {
    Swal.fire({
      title: 'Yakin Menambah Buku?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Tambah',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Ditambahkan!', 'Buku Telah Ditambahkan.', 'success')
        tambahData()
      }
    })
    e.preventDefault()
  })

  if (isStorageExist()) {
    loadDataFromStorage()
  }
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY)
    let data = JSON.parse(serializedData)

    if (data !== null) {
      for (const buku of data) {
        identitasBuku.push(buku)
      }
    }
    document.dispatchEvent(new Event(RENDER_ARRAY))
  }
})

function tambahData() {
  const judulBuku = document.getElementById('judulBuku').value
  const penulis = document.getElementById('penulis').value
  const tahunTerbit = document.getElementById('tahunTerbit').value
  const checkBox = document.getElementById('sudahDibaca').checked
  const jenisBuku = document.getElementById('jenisBuku').value
  const generateID = generateId()
  const bukuObject = generateBukuObject(generateID, judulBuku, penulis, tahunTerbit, jenisBuku, checkBox)
  console.log(bukuObject)
  identitasBuku.unshift(bukuObject)
  document.dispatchEvent(new Event(RENDER_ARRAY))
}
function generateId() {
  return +new Date()
}
function generateBukuObject(id, judulBuku, penulis, tahunTerbit, jenisBuku, isCompleted) {
  return {
    id,
    judulBuku,
    penulis,
    tahunTerbit,
    jenisBuku,
    isCompleted,
  }
}
document.addEventListener(RENDER_ARRAY, function () {
  const belumBaca = document.querySelector('.kotakBelumBaca')
  const sudahBaca = document.querySelector('.kotakSudahBaca')
  belumBaca.innerHTML = ''
  sudahBaca.innerHTML = ''

  for (const butirData of identitasBuku) {
    const elemenBuku = buatDaftar(butirData)
    if (!butirData.isCompleted) {
      belumBaca.append(elemenBuku)
    } else {
      sudahBaca.append(elemenBuku)
    }
  }
  saveData()
})
function buatDaftar(bukuObject) {
  const buatJudul = document.createElement('h3')
  buatJudul.classList.add('judulKonten')
  buatJudul.innerText = bukuObject.judulBuku

  const buatPenulis = document.createElement('p')
  buatPenulis.innerText = 'Penulis : ' + bukuObject.penulis

  const buatTahun = document.createElement('p')
  buatTahun.innerText = 'Tahun Terbit : ' + bukuObject.tahunTerbit

  const buatJenis = document.createElement('p')
  buatJenis.classList.add('jenis')
  if (bukuObject.jenisBuku === '') {
    buatJenis.innerText = 'Tanpa Kategori'
  } else {
    buatJenis.innerText = bukuObject.jenisBuku
  }
  const textContainer = document.createElement('div')
  textContainer.classList.add('dalam')
  const pembatas = document.createElement('hr')
  pembatas.classList.add('batasBuku')
  textContainer.append(buatJudul, buatPenulis, buatTahun, buatJenis)

  const container = document.createElement('div')
  container.classList.add('item')
  container.append(textContainer)
  container.setAttribute('id', `buku-${bukuObject.id}`)

  if (bukuObject.isCompleted) {
    const undoButton = document.createElement('button')
    undoButton.classList.add('undoButton')
    undoButton.innerText = 'Belum Baca'
    undoButton.addEventListener('click', function () {
      undoBukuSelesai(bukuObject.id)
    })

    const trashButton = document.createElement('button')
    trashButton.classList.add('trashButton')
    trashButton.innerText = 'Hapus'
    trashButton.addEventListener('click', function () {
      Swal.fire({
        title: 'Yakin Ingin Menghapus ' + bukuObject.judulBuku + '?',
        text: 'Pilihan Tidak Bisa Dikembalikan',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Hapus',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Terhapus!', 'Buku Telah Dihapus.', 'success')
          hapusBukuSelesai(bukuObject.id)
        }
      })
    })
    const editButton = document.createElement('button')
    editButton.classList.add('editButton')
    editButton.innerText = 'Edit'
    editButton.addEventListener('click', function () {
      window.scrollTo(0, 0)
      const objekBukuId = document.getElementById(`buku-${bukuObject.id}`)
      objekBukuId.classList.add('editSelecting')
      const editBuku = document.querySelectorAll('.editButton')
      editBuku.forEach((editBuku) => {
        editBuku.setAttribute('disabled', '')
      })
      document.querySelector('.fiturEdit').classList.add('turun')
      for (const item of identitasBuku) {
        if (item.id === bukuObject.id) {
          document.getElementById('editJudul').setAttribute('value', item.judulBuku)
          document.getElementById('editPenulis').setAttribute('value', item.penulis)
          document.getElementById('editTahun').setAttribute('value', item.tahunTerbit)
          document.getElementById('simpanEdit').addEventListener('click', function (e) {
            Swal.fire({
              title: 'Yakin Untuk Mengubah?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ubah',
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire('Diubah!', 'Buku Telah Berhasil Diedit.', 'success')
                item.judulBuku = document.getElementById('editJudul').value
                item.penulis = document.getElementById('editPenulis').value
                item.tahunTerbit = document.getElementById('editTahun').value
                item.jenisBuku = document.getElementById('editJenis').value
                document.querySelector('.fiturEdit').classList.remove('turun')
                saveData()
                document.dispatchEvent(new Event(RENDER_ARRAY))
              } else {
                return false
              }
            })
            e.preventDefault()
          })
          return item
        }
      }
    })
    container.append(undoButton, trashButton, editButton, pembatas)

    function hapusBukuSelesai(bukuId) {
      const bukuTarget = findBukuIndex(bukuId)

      if (bukuTarget === -1) return

      identitasBuku.splice(bukuTarget, 1)
      document.dispatchEvent(new Event(RENDER_ARRAY))
      saveData()
    }

    function undoBukuSelesai(bukuId) {
      const bukuTarget = findBuku(bukuId)

      if (bukuTarget == null) return

      bukuTarget.isCompleted = false
      document.dispatchEvent(new Event(RENDER_ARRAY))
      saveData()
    }
  } else {
    const checkButton = document.createElement('button')
    checkButton.classList.add('checkButton')
    checkButton.innerText = 'Selesai'
    const trashButton = document.createElement('button')
    trashButton.classList.add('trashButton')
    trashButton.innerText = 'Hapus'

    trashButton.addEventListener('click', function () {
      Swal.fire({
        title: 'Yakin Ingin Menghapus ' + bukuObject.judulBuku + '?',
        text: 'Pilihan Tidak Bisa Dikembalikan',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Hapus',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Terhapus!', 'Buku Telah Dihapus.', 'success')
          hapusBukuSelesai(bukuObject.id)
        }
      })
    })
    checkButton.addEventListener('click', function () {
      tambahBukuSelesai(bukuObject.id)
    })

    function hapusBukuSelesai(bukuId) {
      const bukuTarget = findBukuIndex(bukuId)

      if (bukuTarget === -1) return

      identitasBuku.splice(bukuTarget, 1)
      document.dispatchEvent(new Event(RENDER_ARRAY))
      saveData()
    }
    const editButton = document.createElement('button')
    editButton.classList.add('editButton')
    editButton.innerText = 'Edit'
    editButton.addEventListener('click', function () {
      window.scrollTo(0, 0)
      const objekBukuId = document.getElementById(`buku-${bukuObject.id}`)
      objekBukuId.classList.add('editSelecting')
      const editBuku = document.querySelectorAll('.editButton')
      editBuku.forEach((editBuku) => {
        editBuku.setAttribute('disabled', '')
      })
      document.querySelector('.fiturEdit').classList.add('turun')
      for (const item of identitasBuku) {
        if (item.id === bukuObject.id) {
          document.getElementById('editJudul').setAttribute('value', item.judulBuku)
          document.getElementById('editPenulis').setAttribute('value', item.penulis)
          document.getElementById('editTahun').setAttribute('value', item.tahunTerbit)
          document.getElementById('simpanEdit').addEventListener('click', function (e) {
            Swal.fire({
              title: 'Yakin Untuk Mengubah?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ubah',
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire('Diubah!', 'Buku Telah Berhasil Diedit.', 'success')
                item.judulBuku = document.getElementById('editJudul').value
                item.penulis = document.getElementById('editPenulis').value
                item.tahunTerbit = document.getElementById('editTahun').value
                item.jenisBuku = document.getElementById('editJenis').value
                document.querySelector('.fiturEdit').classList.add('turun')
                saveData()
                document.dispatchEvent(new Event(RENDER_ARRAY))
              } else {
                return false
              }
            })
            e.preventDefault()
          })
          return item
        }
      }
    })
    container.append(checkButton, trashButton, editButton, pembatas)
  }
  document.querySelector('.batalEdit').addEventListener('click', function () {
    const editBuku = document.querySelectorAll('.editButton')
    editBuku.forEach((editBuku) => {
      editBuku.removeAttribute('disabled')
    })
    document.querySelector('.fiturEdit').classList.remove('turun')
    const objekBukuId = document.getElementById(`buku-${bukuObject.id}`)
    objekBukuId.classList.remove('editSelecting')
  })
  return container
}

function tambahBukuSelesai(bukuId) {
  const bukuTarget = findBuku(bukuId)

  if (bukuTarget == null) {
    return
  }
  bukuTarget.isCompleted = true
  document.dispatchEvent(new Event(RENDER_ARRAY))
  saveData()
}
function findBuku(bukuId) {
  for (const butirData of identitasBuku) {
    if (butirData.id === bukuId) {
      return butirData
    }
  }
  return null
}
function findBukuIndex(bukuId) {
  for (const index in identitasBuku) {
    if (identitasBuku[index].id === bukuId) {
      return index
    }
  }
  return -1
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(identitasBuku)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}
const SAVED_EVENT = 'saved-buku'
const STORAGE_KEY = 'BUKU_APPS'

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Kadada Local Storage Wal ae')
    return false
  }
  return true
}
document.getElementById('cariBuku').addEventListener('keyup', function () {
  const cariBuku = document.getElementById('cariBuku').value.toLowerCase()
  const grupItem = document.querySelectorAll('.item')
  // for (item of grupItem) / for (let i = 0; i < grupItem.length;i++)
  grupItem.forEach((item) => {
    const isiItem = item.firstChild.textContent.toLowerCase()
    if (isiItem.indexOf(cariBuku) != -1) {
      item.setAttribute('style', 'display: block;')
      console.log(isiItem.indexOf(cariBuku))
    } else {
      item.setAttribute('style', 'display: none;')
    }
  })
})
document.querySelector('.containGelapTerang input').addEventListener('click', function () {
  const aside = document.querySelector('aside')
  document.body.classList.toggle('gelapTersier')
  aside.classList.toggle('gelapSekunder')
  document.querySelector('.bolaGerak').classList.toggle('gelapSekunder')
  document.querySelector('.containSudah').classList.toggle('gelapSekunder')
  document.querySelector('.judulSudah').classList.toggle('gelapPrimer')
  document.querySelector('.containBelum').classList.toggle('gelapSekunder')
  document.querySelector('.judulBelum').classList.toggle('gelapPrimer')
  const kotakInput = document.querySelectorAll('#kotakSubmit input')
  for (const kotak of kotakInput) {
    kotak.classList.toggle('gelapPrimer')
  }
  const kotakEdit = document.querySelectorAll('#fiturEdit input')
  for (const kotak of kotakEdit) {
    kotak.classList.toggle('gelapPrimer')
  }
  document.querySelector('#kotakSubmit select').classList.toggle('gelapPrimer')
  document.querySelector('#fiturEdit select').classList.toggle('gelapPrimer')
  document.getElementById('cariBuku').classList.toggle('gelapPrimer')
  document.querySelector('.edith3').classList.toggle('gelapColor')
  const batasBuku = document.querySelectorAll('.batasBuku')
  for (const batas of batasBuku) {
    batas.classList.toggle('batasGelap')
  }
})
