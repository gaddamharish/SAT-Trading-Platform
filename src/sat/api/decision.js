const {runDecisionPipeline}=require('../engine/pipeline');
function createDecisionApi(){return {decide:runDecisionPipeline,executionPolicy:{humanApprovalRequired:true,autonomousOrders:false}};}
module.exports={createDecisionApi};
