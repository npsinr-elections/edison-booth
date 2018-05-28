import { multipartSubmitter } from "./modules/form";
$(() => {
  const form = $("#import-form") as JQuery<HTMLFormElement>;
  multipartSubmitter(form);
});
