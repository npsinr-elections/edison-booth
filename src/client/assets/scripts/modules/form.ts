export function multipartSubmitter(
  form: JQuery<HTMLFormElement>): void {

  form.submit((e: JQuery.Event<HTMLFormElement, null>) => {
    const resourceForm = $(e.currentTarget);
    const data = new FormData(e.currentTarget);
    const redirect = resourceForm.attr("data-redirect");
    $.ajax({
      url: resourceForm.attr("action"),
      method: resourceForm.attr("data-method"),
      data: data,
      cache: false,
      processData: false,
      contentType: false,
      success: (_RES) => {
        switch (redirect) {
          case "reload":
            window.location.reload();
            break;
          case "back":
            window.history.back();
            break;
          default:
            window.location.href = redirect;
        }
      },
      error: (res) => {
        alert(res.responseText);
      }
    });

    e.preventDefault();
  });
}
