const getMenuFrontEnd = ( role = 'USER_ROLE' ) => {
    const menu = [
        {
            titulo: 'Dashboard',
            icono: 'mdi mdi-gauge',
            submenu: [
              { titulo: 'Graficas', url: 'graficas'},
              { titulo: 'Main', url: '/'},
              { titulo: 'ProgressBar', url: 'progress'},
              { titulo: 'Promesas', url: 'promesas'},
              { titulo: 'Rxjs', url: 'rxjs'}
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
    }

    return menu;

}

module.exports = {
    getMenuFrontEnd
}