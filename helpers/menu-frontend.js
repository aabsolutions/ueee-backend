const getMenuFrontEnd = ( role = 'USER_ROLE' ) => {
    const menu = [
        {
            titulo: 'Dashboard',
            icono: 'mdi mdi-gauge',
            submenu: [
              { titulo: 'Main', url: '/'}
            ]
          },
          {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
              { titulo: 'Cursos', url: 'cursos'},
              { titulo: 'Estudiantes', url: 'estudiantes'}
            ]
          }
    ]

    if( role === 'ADMIN_ROLE'){
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: 'usuarios'});
        menu[1].submenu.unshift({ titulo: 'Titulación', url: 'titulacion'});
    }

    return menu;

}

module.exports = {
    getMenuFrontEnd
}