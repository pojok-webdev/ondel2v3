$(function () {
    init = _ => {
      dt = $('#tObj').DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "responsive": true,
        dom:'Bfrtip',
        "oLanguage": {
            "sSearch": "Pencarian"
          },
        ajax:{
          url:'/dataclients',
        },
        "columnDefs": [ 
          {
              "targets": 9,
              "data": null,
              "defaultContent":'<div class="btn-group">'
              +'<button type="button" class="btn btn-default">Aksi</button>'
              +'<button type="button" class="btn btn-default dropdown-toggle dropdown-icon" data-toggle="dropdown">'
              +'<span class="sr-only">Toggle Dropdown</span></button>'
              +'<div class="dropdown-menu dropdown-menu-right" role="menu">'
              +'<a class="dropdown-item btnEditClient" style="cursor:pointer">Edit</a>'
              +'<a class="dropdown-item btnEditCategory" style="cursor:pointer;background:aliceblue">Pengaturan Kategori</a>'
              +'<div class="dropdown-divider"></div>'
              +'<a class="dropdown-item btnRemoveClient" style="cursor:pointer;color:red;"><i class="fa fa-bell"></i>Hapus</a></div>'
              +'</div>'
          },
          {
            targets:7,
            className:"kdfb"
          },
          {
            targets:6,
            className:"description"
          },
          {
            targets:5,
            className:"picwa"
          },
          {
            targets:4,
            className:"picname"
          },
          {
            targets:3,
            className:"address"
          },
          {
            targets:2,
            className:"location_id"
          },
          {
            targets:1,
            className:"name"
          },
          {
            targets:0,
            className:'trid'
          }],
          buttons:[{
            text: 'Penambahan',
            className:'btn btn-success',
            action: function ( e, dt_, node, config ) {
                $('#add-client').modal({
                    backdrop:'static'
                  })
                }
            },
            {
              text:'Refresh',
              className:'btn btn-warning',
              action:function(e,dt_,node,config){
                dt.ajax.reload()
              }
            }

            ]
      })

      $('#editClientCategory').select2({
        tags:true,
        multiple:'multiple',
        val:[6,8],
        ajax:{
          url:function(params){
            console.log("PARAMS of editclient",params)
            if(params.hasOwnProperty('term')){
              return '/select2categoryprovider/'+params.term
            }else{
              return '/select2categoryproviders'
            }
          },
          processResults:obj=>{
            console.log('OBjprocess result',obj)
            return obj
          }
        }
      })
    }
    insertSelectedCategories = _ => {
      $('#editClientCategory').select2('data').forEach(item=>{
        console.log('Item',item.text,item.id)
      })
    }
    init()
    dtCategory = $('#tCategory').DataTable({
      reload:true
    })
    $('#tReserve').on('click','.associate',function(){
      console.log($(this).find('.trid').text())
      $.ajax({
        url:'/associatecategoryclient/'+$(this)
        .stairUp({level:2}).find('.trid').text()+'/'+$('#tObj tbody tr.selected')
        .find('.trid').text()
      })
      .done(res=>{
        dtCategory.ajax.reload()
        dtReserve.ajax.reload()
      })
    })
    $('#tObj').on('click','.btnEditCategory',function(){
      tr = $(this).stairUp({level:4})
      $('#tObj tr').removeClass('selected')
      tr.addClass('selected')
      trid = tr.find('.trid').text()
      clientname = tr.find('.name').text()
      $.ajax({
        url:'/getcategoriesbyclient/'+trid
      })
      .done(res=>{
        console.log('Res',res)
        $('#modalEditCategoryClient').html(' <strong>'+clientname+'</strong>')
        dtReserve = $('#tReserve').DataTable({
          "info": false,destroy:true,
          columnDefs:[
            {targets:0,className:'trid'},
            {targets:2,defaultContent:'<button class="btn btn-primary associate"> > </button>'}
          ],
          ajax:{
            url:'/getavailabelcategories/'+trid,
            dataType:'json',
            processResults:res=>{
              return res
            }
          }
        })
        dtCategory = $('#tCategory').DataTable({
          "paging": false,
          "lengthChange": false,
          "searching": false,
          "ordering": true,
          "info": false,
          "autoWidth": false,
          "responsive": true,
          "destroy":true,
            ajax:{
            url:'/datacategoriesbyclient/'+trid,
            dataType:'json',
          },
          "columnDefs": [ 
            {
              targets:0,
              className:'trid'
            },
          {
              "targets": 3,
              "data": null,
              "defaultContent":'<button class="btn btn-danger btnRemoveCategory"> < </button>'
          },]
        })
        dtCategory.ajax.reload()
        $('#cmbClientCategory').select2({
          ajax:{
            url:function(params){
              if(params.hasOwnProperty('term')){
                return '/select2categoryprovider/'+params.term
              }else{
                return '/select2categoryproviders'
              }
            },
            processResults:obj=>{
              console.log('OBJ got',obj)
              return obj
            }
          }
        })
        $('#edit-category').modal({
          backdrop:'static'
        })
      })
      .fail(err=>{
        console.log('Err',err)
      })
    })
    $('#tObj').on('click','.btnEditClient',function(){
      $('#tObj tr').removeClass('selected')
      tr = $(this).stairUp({
        level:4
      })
      tr.addClass('selected')
      console.log('U click ',tr.find('.trid').text())
      $.ajax({
        url:'/getclient/'+tr.find('.trid').text(),
        dataType:'json',
        type:'get'
      })
      .done(res=>{
        $('#editClientCategory').val(['6','8']).trigger('change');
        //getcategoriesbyclient({client_id:$('#tObj tr.selected').find('.trid').text()})
        console.log('getclient res',res)
        $('#editClientName').val(res[0].name)
        $('#editClientDescription').val(res[0].description)
        $('#editClientPicName').val(res[0].picname)
        $('#editClientPicWa').val(res[0].picwa)
        $('#editClientLocationID').val(res[0].location_id)
        $('#editClientAddress').val(res[0].address)
        $('#editClientFB').val(res[0].kdfb)
        $('#editNetwork').val(res[0].ou)
        $('#edit-client').modal({
          backdrop:'static'
        })
      })
      .fail(err=>{
        console.log('Err',err)
      })
    })

  clearCategoryById = (obj,callback) => {
    $.ajax({
      url:'/disassociatecategoriesbyclient/'+obj.client_id,
    }).done(res=>{
      callback()
    }).fail(err=>{
      console.log('Err disassociatecategoriesbyclient',err)
      callback()
    })
  }
  associateCategoryClient = obj => {
    if(obj.length > 0){
      x = obj.splice(0,1)
      cat = x[0]
      $.ajax({
        url:'/associatecategoryclient/'+cat.id+'/'+$('#tObj tr.selected').find('.trid').text(),
      })
      associateCategoryClient(obj)
    }
  }
  $('#btnTtup').click(function(){
  })
  $("#btnUpdateClient").click(function(){
      $.ajax({
        url:'/updateclient',
        type:'post',
        data:{
          id:$('#tObj tr.selected').find('.trid').text(),
          name:$('#editClientName').val(),
          location_id:$('#editClientLocationID').val(),
          address:$('#editClientAddress').val(),
          picwa:$('#editClientPicWa').val(),
          picname:$('#editClientPicName').val(),
          description:$('#editClientDescription').val(),
          kdfb:$('#editClientFB').val(),
          prevName:$('#tObj tbody tr.selected').find('.name').text(),
          prevLocationID:$('#tObj tbody tr.selected').find('.location_id').text(),
          prevDesc:$('#tObj tbody tr.selected').find('.description').text(),
          prevAddress:$('#tObj tbody tr.selected').find('.address').text(),
          prevPicname:$('#tObj tbody tr.selected').find('.picname').text(),
          prevPicwa:$('#tObj tbody tr.selected').find('.picwa').text(),
          prevKdfb:$('#tObj tbody tr.selected').find('.kdfb').text(),
          ou:$('#editNetwork').val()
        },
        dataType:'json'
      })
      .done(res=>{
        tr = $('#tObj tr.selected')
        tr.find('.name').html($('#editClientName').val())
        tr.find('.location_id').html($('#editClientLocationID').val())
        tr.find('.address').html($('#editClientAddress').val())
        tr.find('.picname').html($('#editClientPicName').val())
        tr.find('.picwa').html($('#editClientPicWa').val())
        tr.find('.description').html($('#editClientDescription').val())
        tr.find('.kdfb').html($('#editClientFB').val())
        console.log("update invoked",res)
        if(1==2){
          dt.ajax.reload()
        }else{

        }
      })
      .fail(err=>{
        console.log(err)
      })
    })

    $('#tObj').on('click','.btnRemoveClient',function(){
      $('#tObj tr').removeClass('selected')
      tr = $(this).stairUp({
        level:4
      })
      tr.addClass('selected')
      console.log('U click ',tr.find('.trid').text())
      $('#confirmRemoveCustomData').modal()
    })

    $('#btnYesRemoveCustomData').click(function(){
      $.ajax({
        url:'/removeclient/'+$('#tObj tr.selected').find('.trid').text()
      })
      .done(res=>{
        console.log('Res',res)
        $('#tObj tr.selected').remove()
      })
      .fail(err=>{
        console.log('Err',err)
      })
    })
    $('#btnSaveClient').click(function(){
      $.ajax({
        url:'/saveclient',
        type:'post',
        dataType:'json',
        data:{
          name:$('#addClientName').val(),
          location_id:$('#addClientLocationID').val(),
          address:$('#addClientAddress').val(),
          picname:$('#addClientPicName').val(),
          picwa:$('#addClientPicWa').val(),
          description:$('#addClientDescription').val(),
          kdfb:$('#addClientFB').val(),
          ou:$('#addNetwork').val()
        }
      })
      .done(res=>{
        console.log('Res',res)
        dt.row.add([
          res.insertId,
          $('#addClientName').val(),
          $('#addClientLocationID').val(),
          $('#addClientAddress').val(),
          $('#addClientPicName').val(),
          $('#addClientPicWa').val(),
          $('#addClientDescription').val(),
          $('#addClientFB').val(),
          $('#addNetwork').val()
        ]).draw()
      })
      .fail(err=>{
        console.log('Error',err)
      })
    })
    $('#btnAssociate').click(function(){
      console.log('Associate',$('#tObj tbody tr.selected').find('.trid').text())
      category_id = $('#cmbClientCategory').val()
      category_name = $('#cmbClientCategory :selected').text()
      $.ajax({
        url:'/associatecategoryclient/'+category_id+'/'+$('#tObj tbody tr.selected').find('.trid').text()
      })
      .done(res=>{
        console.log('Sukses asosiasi',res)
        $.ajax({
          url:'/getcategory/'+category_id
        })
        .done(res=>{
          console.log('Sukses retrieve category',res)
          //dtCategory.row.add([category_id,category_name,res[0].description]).draw()
          dtCategory.ajax.reload()
        })
        .fail(err=>{
          console.log('Error retrieve category',err)
        })
      })
      .fail(err=>{
        console.log('Error asosiasi',err)
      })
    })
    $('#tCategory').on('click','.btnRemoveCategory',function(){
      $('#tCategory tbody tr').removeClass('selected')
      tr = $(this).stairUp({level:2})
      $.ajax({
        url:'/disassociatecategoryclient/'+tr.find('.trid').text()+'/'+$('#tObj tbody tr.selected').find('.trid').text()
      })
      .done(res=>{
        console.log('Success disassociated',res)
        dtCategory.ajax.reload()
        dtReserve.ajax.reload()
      })
      .fail(err=>{
        console.log('Error disassociated',err)
      })
    })
  });
