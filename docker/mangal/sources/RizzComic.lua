-- RizzComic.lua
local RizzComic = {}

-- HTTP Headers
local headers = {
    ["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    ["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    ["Accept-Language"] = "en-US,en;q=0.5",
    ["Accept-Encoding"] = "gzip, deflate",
    ["Connection"] = "keep-alive",
    ["Upgrade-Insecure-Requests"] = "1",
    ["Referer"] = "https://rizzcomic.com/"
}

function RizzComic:SearchManga(query)
    local url = "https://rizzcomic.com/?s=" .. query
    local response = Http.get(url, headers)
    if not response then return {} end

    local doc = Html.parse(response)
    if not doc then return {} end

    local results = {}
    doc:find(".bs .bsx a"):each(function(i, el)
        local name = el:find(".tt"):text()
        local url = el:attr("href")
        if name and url then
            table.insert(results, { name = name, url = url })
        end
    end)
    return results
end

function RizzComic:MangaChapters(url)
    local response = Http.get(url, headers)
    if not response then return {} end

    local doc = Html.parse(response)
    if not doc then return {} end

    local chapters = {}
    doc:find(".bxcl ul li"):each(function(i, el)
        local a = el:find(".eph-num a")
        if a then
            local title = a:find(".chapternum"):text()
            local url = a:attr("href")
            if title and url then
                table.insert(chapters, { name = title, url = url })
            end
        end
    end)
    return chapters
end

function RizzComic:ChapterPages(url)
    local response = Http.get(url, headers)
    if not response then return {} end

    -- Parse the script containing images
    local images = {}
    for img in response:gmatch('"images":%[(.-)%]') do
        for url in img:gmatch('"([^"]+)"') do
            table.insert(images, url)
        end
    end
    return images
end

return RizzComic