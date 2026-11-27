"""English display names for the supplied Brazilian sales extract."""
import re
import calendar

VALUES = {
    'Suplemento Dr Peanut Pasta De Amendoim Sabor Chocotine Em Pote De 600g':'Dr. Peanut Chocotine Peanut Butter, 600 g',
    'Proteína Vegana Blend Vegan Growth 1kg':'Growth Vegan Protein Blend, 1 kg',
    'Creatina Growth Monohidratada Pote 250g':'Growth Creatine Monohydrate, 250 g',
    'Whey Protein Growth Medium Whey 1kg':'Growth Medium Whey Protein, 1 kg',
    'Multivitamínico A Z 120 Caps - Growth Original':'Growth A–Z Multivitamin, 120 Capsules',
    'Kit Whey Protein Concentrado Growth 1kg Creatina Growth 250g':'Growth Whey Concentrate 1 kg + Creatine 250 g',
    'Suplemento Em Pó Whey Protein Concentrado 80% Growth 1kg':'Growth 80% Whey Protein Concentrate, 1 kg',
    'Creatina Growth Creapure Monohidratada Pote 100g':'Growth Creapure Creatine Monohydrate, 100 g',
    'Kit Whey Protein Concentrado Growth 1kg Creatina Growth 100g':'Growth Whey Concentrate 1 kg + Creatine 100 g',
    'Omega 3 Óleo De Peixe Ultra Growth Supplements Pote 75 Caps':'Growth Ultra Omega-3 Fish Oil, 75 Capsules',
    'Sim':'Yes','Não':'No','Sem Sabor':'Unflavored','Sorvete de creme':'Vanilla ice cream',
    'Baunilha':'Vanilla','Morango':'Strawberry','Doce de leite':'Dulce de leche','Clássico':'Classic',
    'Brasil':'Brazil','Correios':'Brazilian Post (Correios)','Entregue':'Delivered','Cancelada pelo comprador':'Canceled by buyer',
    'Mediação finalizada. Te demos o dinheiro':'Mediation resolved in the seller’s favor',
    'Cancelou porque se arrependeu da compra.':'Buyer canceled after changing their mind.',
    'Você pode vê-lo na sua conta Mercado Pago.':'You can view it in your Mercado Pago account.',
}
MONTHS=dict(zip('janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro'.split(),calendar.month_name[1:]))
def label(value):
    if not isinstance(value,str):
        return value
    if value.startswith('Sabor : '):
        return 'Flavor: '+label(value.split(':',1)[1].strip())
    arrived=re.fullmatch(r'Chegou em (\d+) de (\w+)',value)
    if arrived and arrived[2] in MONTHS:
        return f'Delivered on {MONTHS[arrived[2]]} {arrived[1]}'
    return VALUES.get(value,value)
