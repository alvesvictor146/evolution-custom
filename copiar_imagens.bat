@echo off
echo Copiando imagens do Porsche para o projeto Evolution Custom SC...

set SRC=C:\Users\user0636\.gemini\antigravity-ide\brain\739ac595-1c22-42cc-b430-f2d05a7c1671
set DST=C:\Users\user0636\.gemini\antigravity-ide\scratch\evolution-custom-sc

copy "C:\Users\user0636\.gemini\antigravity-ide\brain\7a78c26c-fa52-4356-b84c-425ace17b693\porsche_silver_aligned_1787589232426.jpg" "%DST%\porsche_silver.jpg"
copy "%SRC%\porsche_ppf_black_1787572498510.jpg" "%DST%\porsche_ppf_black.jpg"
copy "%SRC%\porsche_red_1787572508752.jpg" "%DST%\porsche_red.jpg"
copy "%SRC%\porsche_blue_1787572538668.jpg" "%DST%\porsche_blue.jpg"
copy "%SRC%\porsche_green_1787572549560.jpg" "%DST%\porsche_green.jpg"
copy "%SRC%\porsche_gold_1787572561175.jpg" "%DST%\porsche_gold.jpg"

echo.
echo Concluido! Todas as imagens foram atualizadas.
pause
