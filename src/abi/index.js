const abis = {"Election":{"address":"did:bid:000000000000000000000009","abi":[{"name":"registerWitness","inputs":[{"name":"nodeUrl","type":"string"},{"name":"website","type":"string"},{"name":"name","type":"string"}],"outputs":[],"type":"function"},{"name":"unregisterWitness","inputs":[],"outputs":[],"type":"function"},{"name":"voteWitnesses","inputs":[{"name":"candidate","type":"string[]"}],"outputs":[],"type":"function"},{"name":"cancelVote","inputs":[],"outputs":[],"type":"function"},{"name":"startProxy","inputs":[],"outputs":[],"type":"function"},{"name":"stopProxy","inputs":[],"outputs":[],"type":"function"},{"name":"cancelProxy","inputs":[],"outputs":[],"type":"function"},{"name":"setProxy","inputs":[{"name":"proxy","type":"string"}],"outputs":[],"type":"function"},{"name":"stake","inputs":[{"name":"stakeCount","type":"uint256"}],"outputs":[],"type":"function"},{"name":"unStake","inputs":[],"outputs":[],"type":"function"},{"name":"extractOwnBounty","inputs":[],"outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"methodName","type":"string"},{"indexed":false,"name":"status","type":"uint32"},{"indexed":false,"name":"reason","type":"string"},{"indexed":false,"name":"time","type":"uint256"}],"name":"electEvent","type":"event"},{"name":"issueAddtitionalBounty","inputs":[],"outputs":[],"type":"function"},{"name":"queryCandidates","inputs":[{"name":"candiaddress","type":"string"}],"outputs":[{"name":"owner","type":"string"},{"name":"votecount","type":"uint64"},{"name":"active","type":"bool"},{"name":"url","type":"string"},{"name":"totalbounty","type":"uint64"},{"name":"extractedbounty","type":"uint64"},{"name":"lastExtractTime","type":"uint64"},{"name":"website","type":"string"},{"name":"name","type":"string"}],"type":"function"},{"name":"queryAllCandidates","inputs":[],"outputs":[{"name":"listnum","type":"uint64"},{"name":"candinfolist","type":"string"}],"type":"function"},{"name":"queryVoter","inputs":[{"name":"voteraddress","type":"string"}],"outputs":[{"name":"owner","type":"string"},{"name":"isproxy","type":"bool"},{"name":"proxyvotecount","type":"uint64"},{"name":"proxy","type":"string"},{"name":"lastvotecount","type":"uint64"},{"name":"timestamp","type":"uint64"},{"name":"votecandidateslist","type":"string"}],"type":"function"},{"name":"queryStake","inputs":[],"outputs":[{"name":"owner","type":"string"},{"name":"stakecount","type":"uint64"},{"name":"timestamp","type":"uint64"}],"type":"function"},{"name":"queryVoterList","inputs":[{"name":"candiaddress","type":"string"}],"outputs":[{"name":"candiaddress","type":"string"},{"name":"voternum","type":"uint64"},{"name":"voterlist","type":"string"}],"type":"function"}]},"Document":{"address":"did:bid:00000000000000000000000a","abi":[{"name":"InitializationDDO","inputs":[{"name":"bidType","type":"uint64"}],"outputs":[],"type":"function"},{"name":"SetBidName","inputs":[{"name":"bidName","type":"string"}],"outputs":[],"type":"function"},{"name":"FindDDOByType","inputs":[{"name":"key","type":"uint64"},{"name":"value","type":"string"}],"outputs":[],"type":"function"},{"name":"AddPublicKey","inputs":[{"name":"type","type":"string"},{"name":"authority","type":"string"},{"name":"publicKey","type":"string"}],"outputs":[],"type":"function"},{"name":"DeletePublicKey","inputs":[{"name":"publicKey","type":"string"}],"outputs":[],"type":"function"},{"name":"AddProof","inputs":[{"name":"type","type":"string"},{"name":"proofID","type":"string"}],"outputs":[],"type":"function"},{"name":"DeleteProof","inputs":[{"name":"proofID","type":"string"}],"outputs":[],"type":"function"},{"name":"AddAttr","inputs":[{"name":"type","type":"string"},{"name":"value","type":"string"}],"outputs":[],"type":"function"},{"name":"DeleteAttr","inputs":[{"name":"type","type":"string"}],"outputs":[],"type":"function"},{"name":"Enable","inputs":[],"outputs":[],"type":"function"},{"name":"Disable","inputs":[],"outputs":[],"type":"function"},{"name":"IsEnable","inputs":[{"name":"key","type":"uint64"},{"name":"value","type":"string"}],"outputs":[{"name":"result","type":"bool"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"methodName","type":"string"},{"indexed":false,"name":"status","type":"uint32"},{"indexed":false,"name":"reason","type":"string"},{"indexed":false,"name":"time","type":"uint256"}],"name":"bidEvent","type":"event"},{"name":"QueryDocument","inputs":[{"name":"address","type":"string"}],"outputs":[{"name":"documentAddr","type":"string"},{"name":"documentName","type":"string"},{"name":"documentType","type":"string"},{"name":"isEnable","type":"bool"},{"name":"createTime","type":"uint64"},{"name":"updateTime","type":"uint64"}],"type":"function"}]},"Certificate":{"address":"did:bid:00000000000000000000000b","abi":[{"name":"registerCertificate","inputs":[{"name":"Id","type":"string"},{"name":"Context","type":"string"},{"name":"Subject","type":"string"},{"name":"Period","type":"uint64"},{"name":"IssuerAlgorithm","type":"string"},{"name":"IssuerSignature","type":"string"},{"name":"SubjectPublicKey","type":"string"},{"name":"SubjectAlgorithm","type":"string"},{"name":"SubjectSignature","type":"string"}],"outputs":[],"type":"function"},{"name":"revocedCertificate","inputs":[{"name":"id","type":"string"}],"outputs":[],"type":"function"},{"name":"queryPeriod","inputs":[{"name":"id","type":"string"}],"outputs":[{"name":"period","type":"uint64"}],"type":"function"},{"name":"queryActive","inputs":[{"name":"id","type":"string"}],"outputs":[{"name":"isEnable","type":"bool"}],"type":"function"},{"name":"queryIssuer","inputs":[{"name":"id","type":"string"}],"outputs":[{"name":"Issuer","type":"string"}],"type":"function"},{"name":"queryIssuerSignature","inputs":[{"name":"id","type":"string"}],"outputs":[{"name":"Id","type":"string"},{"name":"PublicKey","type":"string"},{"name":"Algorithm","type":"string"},{"name":"Signature","type":"string"}],"type":"function"},{"name":"querySubjectSignature","inputs":[{"name":"id","type":"string"}],"outputs":[{"name":"Id","type":"string"},{"name":"PublicKey","type":"string"},{"name":"Algorithm","type":"string"},{"name":"Signature","type":"string"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"methodName","type":"string"},{"indexed":false,"name":"status","type":"uint32"},{"indexed":false,"name":"reason","type":"string"},{"indexed":false,"name":"time","type":"uint256"}],"name":"cerdEvent","type":"event"}]},"Trustanchor":{"address":"did:bid:00000000000000000000000c","abi":[{"name":"registerTrustAnchor","inputs":[{"name":"anchor","type":"string"},{"name":"anchortype","type":"uint64"},{"name":"anchorname","type":"string"},{"name":"company","type":"string"},{"name":"companyurl","type":"string"},{"name":"website","type":"string"},{"name":"documenturl","type":"string"},{"name":"email","type":"string"},{"name":"desc","type":"string"}],"outputs":[],"type":"function"},{"name":"unRegisterTrustAnchor","inputs":[{"name":"anchor","type":"string"}],"outputs":[],"type":"function"},{"name":"isTrustAnchor","inputs":[{"name":"address","type":"string"}],"outputs":[{"name":"trustanchor","type":"bool"}],"type":"function"},{"name":"updateBaseAnchorInfo","inputs":[{"name":"anchor","type":"string"},{"name":"companyUrl","type":"string"},{"name":"email","type":"string"}],"outputs":[],"type":"function"},{"name":"updateExetendAnchorInfo","inputs":[{"name":"anchor","type":"string"},{"name":"companyUrl","type":"string"},{"name":"website","type":"string"},{"name":"documentUrl","type":"string"},{"name":"email","type":"string"},{"name":"desc","type":"string"}],"outputs":[],"type":"function"},{"name":"extractOwnBounty","inputs":[{"name":"anchor","type":"string"}],"outputs":[],"type":"function"},{"name":"queryTrustAnchor","inputs":[{"name":"anchor","type":"string"}],"outputs":[{"name":"id","type":"string"},{"name":"anchorname","type":"string"},{"name":"company","type":"string"},{"name":"companyurl","type":"string"},{"name":"website","type":"string"},{"name":"doc","type":"string"},{"name":"email","type":"string"},{"name":"desc","type":"string"},{"name":"anchortype","type":"uint64"},{"name":"status","type":"uint64"},{"name":"active","type":"bool"},{"name":"totalbounty","type":"uint64"},{"name":"extractedBounty","type":"uint64"},{"name":"lastExtracTime","type":"uint64"},{"name":"votecount","type":"uint64"}],"type":"function"},{"name":"queryTrustAnchorStatus","inputs":[{"name":"anchor","type":"string"}],"outputs":[{"name":"anchorstatus","type":"uint8"}],"type":"function"},{"name":"queryBaseTrustAnchorList","inputs":[],"outputs":[{"name":"baseList","type":"string"}],"type":"function"},{"name":"queryBaseTrustAnchorNum","inputs":[],"outputs":[{"name":"baseListNum","type":"uint64"}],"type":"function"},{"name":"queryExpendTrustAnchorList","inputs":[],"outputs":[{"name":"expendList","type":"string"}],"type":"function"},{"name":"queryExpendTrustAnchorNum","inputs":[],"outputs":[{"name":"expendListNum","type":"uint64"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"methodName","type":"string"},{"indexed":false,"name":"status","type":"uint32"},{"indexed":false,"name":"reason","type":"string"},{"indexed":false,"name":"time","type":"uint256"}],"name":"trustAnchorEvent","type":"event"},{"name":"voteElect","inputs":[{"name":"candidate","type":"string"}],"outputs":[],"type":"function"},{"name":"cancelVote","inputs":[{"name":"candidate","type":"string"}],"outputs":[],"type":"function"}]}}
export default abis