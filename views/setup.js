import handlebars from 'handlebars';

handlebars.registerHelper('toGlobal', context => {
  const vars = [];
  for (let varName in context) {
    vars.push(`window.${varName}=${JSON.stringify(context[varName])};`);
  }
  return ';' + vars.join('');
});
