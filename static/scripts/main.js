$(document).ready(function () {

  const data = [];
  const activeIdx = -1;

  getPayments();
  setInterval(getPayments, 2500);

  function getPayments() {
    $.ajax({
      url: '/api/getPayments',
      success: function (res) {
        data = res
        renderPreviews()
      }
    })
  }

  function renderPreviews() {
    $('#payments').html(
        data.map((i) => '<li data-qid="' + i._id + '">' + i.author + i.receiver
        + '</li>').join('')
    )
  }

  $('#new-payment').on('click', function () {
    $('.modal').css('display', 'block');
  })

  $('#close').on('click', function () {
    $('.modal').css('display', 'none');
  })

  $('#submit-payment').on('click', function () {
    const paymentAmount = $('#payment-amount').val();
    const receiver = $('#payment-receiver').val();
    $.ajax({
      url: '/api/addPayment',
      data: { paymentAmount, receiver },
      type: 'POST',
      success: function(res) {
        console.log(res)
        $('.modal').css('display', 'none')
      }
    })
  })

  $('#add-money').on('click', function () {
    $('.modal2').css('display', 'block');
  })

  $('#close2').on('click', function () {
    $('.modal2').css('display', 'none');
  })

  $('#submit-addition').on('click', function () {
    const moneyAdded = $('#money-added').val();
    $.ajax({
      url: '/api/addMoney',
      data: { moneyAdded },
      type: 'POST',
      success: function(res) {
        console.log(res)
        $('.modal2').css('display', 'none')
      }
    })
  })
})
