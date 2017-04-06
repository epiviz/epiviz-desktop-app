#!/bin/bash
#
# Bash script for launching epiviz from command line,
# based on atom.sh from Epiviz text editor:
#  https://github.com/atom/atom
#
# Script based on https://github.com/antonycourtney/tad
#

if [ "$(uname)" == 'Darwin' ]; then
  OS='Mac'
elif [ "$(expr substr $(uname -s) 1 5)" == 'Linux' ]; then
  OS='Linux'
else
  echo "Your platform ($(uname -a)) is not supported."
  exit 1
fi

if [ "$(basename $0)" == 'epiviz-beta' ]; then
  BETA_VERSION=true
else
  BETA_VERSION=
fi

export EPIVIZ_DISABLE_SHELLING_OUT_FOR_ENVIRONMENT=true

while getopts ":wtfvh-:" opt; do
  case "$opt" in
    -)
      case "${OPTARG}" in
        wait)
          WAIT=1
          ;;
        help|version)
          REDIRECT_STDERR=1
          EXPECT_OUTPUT=1
          ;;
        foreground|test)
          EXPECT_OUTPUT=1
          ;;
      esac
      ;;
    w)
      WAIT=1
      ;;
    h|v)
      REDIRECT_STDERR=1
      EXPECT_OUTPUT=1
      ;;
    f|t)
      EXPECT_OUTPUT=1
      ;;
  esac
done

if [ $REDIRECT_STDERR ]; then
  exec 2> /dev/null
fi

if [ $EXPECT_OUTPUT ]; then
  export ELECTRON_ENABLE_LOGGING=1
fi

if [ $OS == 'Mac' ]; then
  if [ -n "$BETA_VERSION" ]; then
    EPIVIZ_APP_NAME="Epiviz Beta.app"
    EPIVIZ_EXECUTABLE_NAME="Epiviz Beta"
  else
    EPIVIZ_APP_NAME="Epiviz.app"
    EPIVIZ_EXECUTABLE_NAME="Epiviz"
  fi

  if [ -z "${EPIVIZ_PATH}" ]; then
    # If EPIVIZ_PATH isnt set, check /Applications and then ~/Applications for EPIVIZ.app
    if [ -x "/Applications/$EPIVIZ_APP_NAME" ]; then
      EPIVIZ_PATH="/Applications"
    elif [ -x "$HOME/Applications/$EPIVIZ_APP_NAME" ]; then
      EPIVIZ_PATH="$HOME/Applications"
    else
      # We havent found an Epiviz.app, use spotlight to search for Epiviz
      # EPIVIZ_PATH="$(mdfind "kMDItemCFBundleIdentifier == 'org.epiviz.epiviz'" | grep -v ShipIt | head -1 | xargs -0 dirname)"

      # Exit if Epiviz can't be found
      if [ ! -x "$EPIVIZ_PATH/$EPIVIZ_APP_NAME" ]; then
        echo "Cannot locate Epiviz.app, it is usually located in /Applications. Set the EPIVIZ_PATH environment variable to the directory containing Epiviz.app."
        exit 1
      fi
    fi
  fi

  if [ $EXPECT_OUTPUT ]; then
    "$EPIVIZ_PATH/$EPIVIZ_APP_NAME/Contents/MacOS/$EPIVIZ_EXECUTABLE_NAME" "$@"
    exit $?
  else
    # open -a "$EPIVIZ_PATH/$EPIVIZ_APP_NAME" -n --args --executed-from="$(pwd)" --pid=$$ --path-environment="$PATH" "$@"
    # echo "Starting $EPIVIZ_PATH/$EPIVIZ_APP_NAME" -n --args --executed-from="$(pwd)" "$@"
    open -a "$EPIVIZ_PATH/$EPIVIZ_APP_NAME/Contents/MacOS/$EPIVIZ_EXECUTABLE_NAME" -n --args "$@"
  fi
elif [ $OS == 'Linux' ]; then
  SCRIPT=$(readlink -f "$0")
  USR_DIRECTORY=$(readlink -f $(dirname $SCRIPT)/..)

  if [ -n "$BETA_VERSION" ]; then
    EPIVIZ_PATH="$USR_DIRECTORY/share/epiviz-beta/epiviz"
  else
    EPIVIZ_PATH="$USR_DIRECTORY/share/epiviz/epiviz"
  fi

  EPIVIZ_HOME="${EPIVIZ_HOME:-$HOME/.epiviz}"
  mkdir -p "$EPIVIZ_HOME"

  : ${TMPDIR:=/tmp}

  [ -x "$EPIVIZ_PATH" ] || EPIVIZ_PATH="$TMPDIR/epiviz-build/Epiviz/epiviz"

  if [ $EXPECT_OUTPUT ]; then
    "$EPIVIZ_PATH" --executed-from="$(pwd)" --pid=$$ "$@"
    exit $?
  else
    (
    nohup "$EPIVIZ_PATH" --executed-from="$(pwd)" --pid=$$ "$@" > "$EPIVIZ_HOME/nohup.out" 2>&1
    if [ $? -ne 0 ]; then
      cat "$EPIVIZ_HOME/nohup.out"
      exit $?
    fi
    ) &
  fi
fi

# Exits this process when Epiviz is used as $EDITOR
on_die() {
  exit 0
}
trap 'on_die' SIGQUIT SIGTERM

# If the wait flag is set, don't exit this process until Epiviz tells it to.
if [ $WAIT ]; then
  while true; do
    sleep 1
  done
fi