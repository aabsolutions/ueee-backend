const getMenuFrontEnd = ( role = 'USER_ROLE' ) => {
    const menu = [
        {
            titulo: 'Personal',
            icono: 'mdi mdi-gauge',
            submenu: [
              { titulo: 'Dashboard', url: '/'},
            ]
          },
          {
            titulo: 'Estudiantes',
            icono: 'mdi mdi-account-multiple',
            submenu: [
              { titulo: 'Registro', url: 'estudiantes/nuevo'},
              { titulo: 'Asignación de curso', url: 'asignacion'}
            ]
          },
          {
            titulo: 'Cursos',
            icono: 'mdi mdi-school',
            submenu: [
              { titulo: 'Administración', url: 'cursos'},
            ]
          },
          {
            titulo: 'Gestion escolar',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
              { titulo: 'Titulación', url: 'gestion/titulacion'},
              { titulo: 'Listados', url: 'gestion/listados'}
            ]
          }
    ]

    if( role === 'ADMIN_ROLE'){
        menu[0].submenu.push({ titulo: 'Usuarios', url: 'usuarios'});
    }

    return menu;

}

module.exports = {
    getMenuFrontEnd
}