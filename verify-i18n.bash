npm run i18n:extract

if [[ `git status libs/ng/src/lib/translation/locale/*.json --porcelain` ]] || [[ `git status apps/frontend/src/locale/*.json --porcelain` ]]
then
	echo "Locales are not up to date."
	exit 1
fi

if grep "\": null"  libs/ng/src/lib/translation/locale/*.json apps/frontend/src/locale/*.json -q
then
	echo "Some locales are not set."
	exit 1
fi

echo "Locales are up to date."
