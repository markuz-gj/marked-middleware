GULP="node_modules/.bin/gulp"

while :; do
  echo "stating gulp..."
  rm -rf dist 2>/dev/null
  $GULP $@
  exitStatus=$?
  echo "$@" | grep -q 'watch' || exit $exitStatus
  echo "error status: $exitStatus"
  echo "restarting in 1 sec"
  echo
  sleep 1
done


