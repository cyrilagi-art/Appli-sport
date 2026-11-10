/* ===== Douleurs : charge de chaque exercice sur chaque zone (1 = modérée, 2 = forte) ===== */
const ZONES=[
  {k:"ce",n:"Cervicales",s:"nuque"},{k:"ep",n:"Épaules",s:"épaules"},{k:"po",n:"Poignets",s:"poignets"},
  {k:"lo",n:"Lombaires",s:"bas du dos"},{k:"ge",n:"Genoux",s:"genoux"},{k:"ac",n:"Tendon d’Achille",s:"talons et chevilles"}];
const PN={
  squat:{ge:1},fentes:{ge:2},pompes:{po:2,ep:1},pompesg:{po:1,ep:1},mountain:{po:1,lo:1,ac:1},burpees:{po:2,lo:1,ge:2,ac:2,ep:1},
  crunch:{ce:2,lo:1},releve:{lo:2},mollets:{ac:2},highknees:{ac:2,ge:1,lo:1},jj:{ac:2,ge:1},squatjump:{ac:2,ge:2,lo:1},
  g_fente:{ge:2},g_chaise:{ge:2},g_planche:{ep:1,lo:1},g_cote:{ep:1,lo:1},g_bras:{po:2,ep:1,lo:1},g_inv:{lo:2,ce:1},
  g_abdos:{lo:1,ce:1},g_bassin:{lo:1},g_epaules:{po:2,ep:2,ce:1},g_dorsaux:{lo:2,ce:1},g_plongeon:{lo:2,ce:2},
  ecarter:{po:1,ep:1},plafond:{po:1,ep:1},coude:{ep:2},golfeur:{lo:1,ge:1},genoux:{ge:2},cravate:{lo:1},combine:{lo:2,ge:1},
  talonfesse:{ge:2},turques:{ge:2},pointes:{},
  talonsfesses:{ac:2,ge:1},boxe:{ep:1},fentearr:{ge:2,lo:1},sqpause:{ge:2},planchemd:{po:2,ep:1,lo:1},corde:{ac:2,ge:1,lo:1}};
EX.forEach(e=>{e.pn=PN[e.id]||{}});
