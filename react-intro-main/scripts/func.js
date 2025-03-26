
function runexe(tex, tbtex)
{

    $.ajax({
        url: "txtedit/www/runexe.php",
        method: "POST",
        data: {'code' : tex ,'tb_code' : tbtex},
        dataType: 'html',
        success: function(response) {
            // Вставляем ответ в элемент HTML
            $('#news').html(response);
        }
    });
}


$(document).ready(function() {
    loadNews();
})

function showConfirmation() {
    var result = window.confirm("Чтобы загрузить файл нажмите \"Ок\" или \"Отмена\", чтобы открыть в другой вкладке ");
    if (result) {
      download();
    } else {
      openWeb();
    }
  }
  
  function download() {
    const url = 'txtedit/www/programms/out.vcd';
    const fileName = 'out.vcd';

    downloadFileFromServer(url, fileName);

  }
  
  function openWeb() {
    window.open('txtedit/www/programms/out.php', '_blank');
  }

  function downloadFileFromServer(url, fileName) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      if (this.status === 200) {
        const blob = this.response;
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    };
    xhr.send();
  }