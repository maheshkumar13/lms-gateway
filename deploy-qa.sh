git checkout qa
git pull origin qa
export CI_BUILD_REF=latest;
export NAMESPACE=qa;
export RELEASE_NAME=gateway-${NAMESPACE}-lms
export DEPLOYS=$(helm ls | grep $RELEASE_NAME | wc -l)
if [ ${DEPLOYS}  -eq 0 ]; then helm install --name=${RELEASE_NAME} charts --set image.tag=${CI_BUILD_REF} -f charts/values/eks/${NAMESPACE}.yaml --namespace=${NAMESPACE}; else helm upgrade ${RELEASE_NAME} charts --set image.tag=${CI_BUILD_REF} -f charts/values/eks/${NAMESPACE}.yaml --namespace=${NAMESPACE}; fi
